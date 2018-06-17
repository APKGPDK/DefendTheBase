import * as BABYLON from 'babylonjs'
import Game from './Game';
import { MeshAssets } from "../MeshAssets";
import Entity from './Entity';
import System from './System';

export interface MeshModel {
    name: string,
    meshName: keyof typeof MeshAssets,
    position?: BABYLON.Vector3,
    scaling?: BABYLON.Vector3,
    rotation?: BABYLON.Vector3
}

export default class Scene {
    public scene: BABYLON.Scene
    private meshPrefabs: BABYLON.Mesh

    constructor(protected game: Game) {
        this.scene = new BABYLON.Scene(game.getEngine())
        this.meshPrefabs = new BABYLON.Mesh('prefabs')
        this.meshPrefabs.setEnabled(false)
    }

    async create() {
        await this.onCreate()
    }

    update() {
        this.onUpdate()
        this.scene.render()
    }

    destroy() {
        this.scene.dispose();
        this.onDestroy()
    }

    onCreate() { }
    onUpdate() { }
    onDestroy() { }

    preloadAssets(meshAssets: { [key: string]: string }, textureAssets: { [key: string]: string }) {
        return Promise.all([new Promise((resolve, reject) => {
            const assetsManager = new BABYLON.AssetsManager(this.scene)
            assetsManager.useDefaultLoadingScreen = false;

            for (let key in meshAssets) {
                assetsManager.addMeshTask(key, "", "assets/", meshAssets[key])
            }
            assetsManager.onTaskSuccessObservable.add(task => {
                if (task instanceof BABYLON.MeshAssetTask) {
                    let mesh: BABYLON.Mesh
                    if (task.loadedMeshes.length > 1) {
                        mesh = new BABYLON.Mesh(task.name)
                        task.loadedMeshes.forEach(loadedMesh => mesh.addChild(loadedMesh))
                    } else {
                        mesh = task.loadedMeshes[0] as BABYLON.Mesh
                    }
                    mesh.setParent(this.meshPrefabs)
                    this.game.addMeshData(task.name, mesh)
                }
            });
            assetsManager.onFinish = () => {
                resolve()
            }

            assetsManager.onTaskErrorObservable.add(function(task, state) {
                console.log('task failed', task.errorObject.message, task.errorObject.exception, state);
                reject(task)
            });

            assetsManager.load()
        }), new Promise((resolve, reject) => {
            const assetsManager = new BABYLON.AssetsManager(this.scene)
            assetsManager.useDefaultLoadingScreen = false;

            for (let key in textureAssets) {
                assetsManager.addTextureTask(key, "assets/" + textureAssets[key])
            }
            assetsManager.onFinish = async (tasks: BABYLON.AbstractAssetTask[]) => {
                tasks.forEach(task => {
                    if (task instanceof BABYLON.TextureAssetTask) {
                        this.game.addTextureData((task.name as any), task.texture)
                    }
                })
                resolve()
            }
            assetsManager.onTaskError = error => reject(error)

            assetsManager.load()
        })])
    }

    createMesh({ name, meshName, position = BABYLON.Vector3.Zero(), scaling = new BABYLON.Vector3(1, 1, 1),  rotation = BABYLON.Vector3.Zero() }: MeshModel ) {
        const originalMesh = this.game.getMeshData(meshName)
        const mesh = originalMesh.clone(name)
        if(originalMesh.skeleton) {
            mesh.skeleton = (originalMesh.skeleton as any).clone()
        }
        mesh.setParent(null)
        mesh.position = position
        mesh.scaling = scaling
        mesh.rotation = rotation
        return mesh
    }

    createEntity(meshModel: MeshModel) {
        const mesh = this.createMesh(meshModel);
        const entity = new Entity(mesh);
        (entity.mesh as any).parentEntity = entity;
        return entity;
    }

    disposeEntity(entity: Entity) {
        entity.systems.forEach(systemName => this.game.removeEntityFromSystem(entity, systemName))
        entity.dispose()
    }

    setPhysicsImpostor(entity: Entity, { type, options }: {
        type: number,
        options: BABYLON.PhysicsImpostorParameters
    }) {
        entity.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(entity.mesh, type, options, this.scene)
    }


}