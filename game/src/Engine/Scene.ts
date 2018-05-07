import * as BABYLON from 'babylonjs'
import Game from './Game';
import { MeshAssets } from "../MeshAssets";
import Entity from './Entity';
import System from './System';

export interface MeshModel {
    name: string,
    meshName: keyof typeof MeshAssets,
    position?: BABYLON.Vector3,
    scaling?: BABYLON.Vector3
}

export default class Scene {
    protected scene: BABYLON.Scene
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
        this.onDestroy()
    }

    onCreate() { }
    onUpdate() { }
    onDestroy() { }

    preloadAssets(assets: { [key: string]: string }) {
        return new Promise((resolve, reject) => {
            const assetsManager = new BABYLON.AssetsManager(this.scene)
            assetsManager.useDefaultLoadingScreen = false;

            for (let key in assets) {
                assetsManager.addMeshTask(key, "", "assets/", assets[key])
            }

            assetsManager.onFinish = async (tasks: BABYLON.MeshAssetTask[]) => {
                tasks.forEach(task => {
                    let mesh: BABYLON.Mesh
                    if (task.loadedMeshes.length > 1) {
                        mesh = new BABYLON.Mesh(task.name)
                        task.loadedMeshes.forEach(loadedMesh => mesh.addChild(loadedMesh))
                    } else {
                        mesh = task.loadedMeshes[0] as BABYLON.Mesh
                    }
                    mesh.setParent(this.meshPrefabs)
                    this.game.addMeshData(task.name, mesh)
                })
                resolve()
            }

            assetsManager.load()
        })
    }

    createMesh({ name, meshName, position = BABYLON.Vector3.Zero(), scaling = new BABYLON.Vector3(1, 1, 1) }: MeshModel) {
        const mesh = this.game.getMeshData(meshName).clone(name)
        mesh.setParent(null)
        mesh.position = position
        mesh.scaling = scaling
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