import * as BABYLON from 'babylonjs'
import Scene from './Scene';
import { MeshAssets } from '../MeshAssets';
import System, { SystemInterface } from './System';
import Entity from './Entity';
import { TimeManager } from './TimeManager';

export default class Game {
    public timeManager: TimeManager
    private engine: BABYLON.Engine;
    private systems: System[] = []
    private runningScenes: Scene[] = []
    private currentScene: Scene = null
    private meshes: {
        [key: string]: BABYLON.Mesh
    } = {}

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        })
        this.engine.enableOfflineSupport = false

        window.addEventListener('resize', () => {
            this.engine.resize()
        })

        this.timeManager = new TimeManager
    }

    async instantiateScene(sceneName: typeof Scene) {
        const scene = new sceneName(this)
        await scene.create()
        this.runningScenes.push(scene)
        return scene
    }

    getEngine() {
        return this.engine
    }

    getCanvas() {
        return this.canvas
    }

    start(sceneName: typeof Scene = null) {
        if (sceneName) {
            this.switchScene(sceneName)
        }

        this.engine.runRenderLoop(() => {
            this.timeManager.tick()
            this.systems.forEach(system => {
                system.update()
            })
            this.currentScene && this.currentScene.update()
        })
    }

    async switchScene(sceneName: typeof Scene) {
        let nextScene: Scene
        const runningScenes = this.runningScenes.filter((scene: Scene) => scene instanceof sceneName)
        if (runningScenes.length) {
            nextScene = runningScenes[0]
        } else {
            nextScene = runningScenes.length ? runningScenes[0] : await this.instantiateScene(sceneName)
        }

        if (this.currentScene) {
            this.runningScenes = this.runningScenes.filter((scene: Scene) => this.currentScene === scene)
            this.currentScene.destroy()
        }

        this.currentScene = nextScene
    }

    getCurrentScene() {
        return this.currentScene
    }

    addMeshData(name: keyof typeof MeshAssets, data: BABYLON.Mesh) {
        this.meshes[name] = data
    }

    getMeshData(name: keyof typeof MeshAssets) {
        return this.meshes[name]
    }

    registerSystem(systemName: new (game: Game) => System) {
        this.systems.push(new systemName(this))
    }

    getSystem<T extends typeof System>(systemName: T): T['prototype'] {
        return this.systems.find(system => system instanceof (systemName as any)) as any
    }

    addEntityToSystem(entity: Entity, systemName: typeof System) {
        const system = this.systems.find(system => system instanceof systemName)
        entity.markSystem(systemName);
        system.add(entity);
    }

    removeEntityFromSystem(entity: Entity, systemName: typeof System) {
        const system = this.systems.find(system => system instanceof systemName)
        system.entities = system.entities.filter(systemEntity => systemEntity != entity)
        entity.unmarkSystem(systemName);
    }

}