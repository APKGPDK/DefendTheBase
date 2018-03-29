import Scene from "../Engine/Scene";

export default class GameScene extends Scene {
    private camera: BABYLON.FreeCamera

    onCreate() {
        console.log('Jestem w drugiej scenie!')
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero())
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(10, -5, 0), this.scene);
        const light2 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-10, 5, 0), this.scene);
        light.intensity = 10
        const assetsManager = new BABYLON.AssetsManager(this.scene);
        assetsManager.useDefaultLoadingScreen = false;
        const meshTask = assetsManager.addMeshTask("bush task", "", "assets/", "Bush1.babylon");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        }
        meshTask.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        assetsManager.load();
    }

    onUpdate() {

    }

    onDestroy() {

    }
}