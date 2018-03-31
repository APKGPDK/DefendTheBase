import Game from './Game';
import { MeshAssets } from "../MeshAssets";

export default class Scene {
    protected scene: BABYLON.Scene

    constructor(protected game: Game) {
        this.scene = new BABYLON.Scene(game.getEngine())
    }

    create() {
        this.onCreate()
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

    createMesh(name: string, meshName: keyof typeof MeshAssets, position: BABYLON.Vector3 = BABYLON.Vector3.Zero()) {
        let mesh = this.game.getMeshData(meshName)
        return new BABYLON.Mesh(name, this.scene, null, mesh)
    }
}