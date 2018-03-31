import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";
import { MeshAssets } from "../MeshAssets";

export default class GameScene extends Scene {
    private camera: BABYLON.FreeCamera

    onCreate() {
        this.scene.debugLayer.show()
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero())
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)

        const assetsManager = new BABYLON.AssetsManager(this.scene)

        for(let key in MeshAssets) {
            assetsManager.addMeshTask(key, "", "assets/", MeshAssets[key])
        }

        assetsManager.onFinish = (tasks: BABYLON.MeshAssetTask[]) => {
            tasks.forEach(task => {
                let mesh = new BABYLON.Mesh(task.name)
                task.loadedMeshes.forEach(loadedMesh => mesh.addChild(loadedMesh))
                this.game.addMeshData(task.name, mesh)

                let busz = this.createMesh("busz", "Bush")
                busz.position = BABYLON.Vector3.Zero()
            })
        }

        assetsManager.load()

        const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false)
    }

    onUpdate() {

    }

    onDestroy() {

    }
}