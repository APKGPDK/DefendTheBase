import * as BABYLON from 'babylonjs'
import Scene from './Scene';

export default class Game {
    private engine: BABYLON.Engine;
    private runningScenes: Scene[] = []
    private currentScene: Scene = null

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        })

        window.addEventListener('resize', () => {
            this.engine.resize()
        })
    }

    instantiateScene(sceneName: typeof Scene) {
        const scene = new sceneName(this)
        scene.create()
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
        if(sceneName) {
            this.switchScene(sceneName)
        }

        this.engine.runRenderLoop(() => {
            this.currentScene && this.currentScene.update()
        })
    }

    switchScene(sceneName: typeof Scene) {
        let nextScene: Scene
        const runningScenes = this.runningScenes.filter((scene: Scene) => scene instanceof sceneName)
        if(runningScenes.length) {
            nextScene = runningScenes[0]
        } else {
            nextScene = runningScenes.length ? runningScenes[0] : this.instantiateScene(sceneName)
        }

        if(this.currentScene) {
            this.runningScenes = this.runningScenes.filter((scene: Scene) => this.currentScene === scene)
            this.currentScene.destroy()
        }

        this.currentScene = nextScene
    }

}