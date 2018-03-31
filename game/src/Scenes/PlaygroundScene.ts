import Scene from "../Engine/Scene";
import { Mesh } from "babylonjs";

export default class GameScene extends Scene {
    private camera: BABYLON.FreeCamera

    onCreate() {
        console.log('Jestem w drugiej scenie!')
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 3, -12), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 10, 3), this.scene);
        light.intensity = 5;
        light.specular = new BABYLON.Color3(0, 0, 0);
        //light.shadowEnabled = true;
        //const light2 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-10, 5, 0), this.scene);
        const assetsManager = new BABYLON.AssetsManager(this.scene);
        assetsManager.useDefaultLoadingScreen = false;
        const meshTask = assetsManager.addMeshTask("bush task", "", "assets/", "Bush2.babylon");
        const meshTask1 = assetsManager.addMeshTask("Tree1 task", "", "assets/", "Tree1.babylon");
        const meshTask2 = assetsManager.addMeshTask("Base task", "", "assets/", "Base.babylon");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new  BABYLON.Vector3(3, 0, 3);
            console.log(task.loadedMeshes);
            const abc = task.loadedMeshes[0].clone("test", this.scene);
            abc.position = new BABYLON.Vector3(-2, 0, 2);
        }
        meshTask.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        meshTask1.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(0, 0, 4)
        }

        meshTask2.onSuccess =  (task) => {
            task.loadedMeshes[0].position = new BABYLON.Vector3(6,  0, 0)
            //task.loadedMeshes[1].beginAnimation("rotation animation", true, 1);
            this.scene.beginAnimation(task.loadedMeshes[1], 0, 300, true)
            console.log(task.loadedMeshes[1].animations);
            console.log(task.loadedMeshes);
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