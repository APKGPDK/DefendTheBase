import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";
import { int } from "babylonjs";

export default class GameScene extends Scene {
    private camera: BABYLON.UniversalCamera
    private enemy: BABYLON.AbstractMesh
    private hp: int
    private killed: boolean

  

    onCreate() {
        // this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
        // this.camera.setTarget(BABYLON.Vector3.Zero())
        // this.camera.attachControl(this.game.getCanvas(), false)
        // const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)
        // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene, false, BABYLON.Mesh.FRONTSIDE)
        // sphere.position.y = 1

        // sphere.actionManager = new BABYLON.ActionManager(this.scene);

        // // sphere.actionManager.registerAction(
        // //     new BABYLON.ExecuteCodeAction(
        // //         BABYLON.ActionManager.OnPickTrigger,
        // //         () => {
        // //             console.log('Kliknięto!')
        // //             this.game.switchScene(PlaygroundScene)
        // //         }
        // //     )
        // // );
        // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false)
        
        this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 3, -9), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 10, 3), this.scene);
        light.intensity = 5;
        light.specular = new BABYLON.Color3(0, 0, 0);

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
            task.loadedMeshes[0].position = new BABYLON.Vector3(6,  1, 0)
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

       
        this.createEnemy();
        this.hp = 100;
      
    }

    createEnemy() {
        this.killed = false;
        BABYLON.SceneLoader.ImportMesh(null, "assets/", "Enemy.babylon", this.scene, (meshes) => {
            this.enemy = meshes[0];
            this.enemy.position = new BABYLON.Vector3(-4, 0.5, 0);
            this.enemy.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            this.enemy.actionManager = new BABYLON.ActionManager(this.scene);
        this.enemy.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnLeftPickTrigger,
                    () => {
                        console.log('Enemy destroyed!')
                        this.enemy.dispose(); 
                        this.killed = true;
                        this.enemy.position = new BABYLON.Vector3(-4, 0.5, 0);
                        this.createEnemy();
                        
                    }
                ));
        });

    }

  

    onUpdate() {
        if( this.enemy){
            if(!this.killed && this.enemy.position.x < 4){
                this.enemy.position.x += 0.1;              
                
            } else if (!this.killed){
                console.log("Your base got hit!");
                this.hp --;
                if(!this.hp)
                console.log("Your base got destroyed!");
            } 
        }
        
    }

    onDestroy() {

    }
}