import Scene from "../Engine/Scene";
import { Mesh } from "babylonjs";

export default class GameScene extends Scene {
    private camera: BABYLON.FreeCamera

    onCreate() {
        console.log('Jestem w drugiej scenie!')
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 3, -12), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-23, -10, 3), this.scene);
        light.intensity = 8;
        //light.shadowEnabled = true;
        //const light2 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-10, 5, 0), this.scene);
        const assetsManager = new BABYLON.AssetsManager(this.scene);
        assetsManager.useDefaultLoadingScreen = false;
        const meshTask = assetsManager.addMeshTask("bush task", "", "assets/", "Bush3.babylon");
        const meshTask1 = assetsManager.addMeshTask("Tree1 task", "", "assets/", "Tree1.babylon");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new  BABYLON.Vector3(3, 0, 3);
            console.log(task.loadedMeshes);
            const abc = task.loadedMeshes[0].clone("test", this.scene);
            abc.position = new BABYLON.Vector3(-2, 0, 2);
          // task.loadedMeshes[]
            //task.loadedMeshes[1].position = new BABYLON.Vector3(0, 0, 4)
        }
        meshTask.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        const ground = BABYLON.Mesh.CreateGround('ground1', 50, 30, 10, this.scene, false);
        var grassMaterial = new BABYLON.StandardMaterial("Grass", this.scene);
        grassMaterial.alpha = 1;
        grassMaterial.diffuseColor = new BABYLON.Color3(0, 1,0);
        ground.material = grassMaterial;
        assetsManager.load();

        this.scene.debugLayer.show();
        
    }

    onUpdate() {

    }

    onDestroy() {

    }
}