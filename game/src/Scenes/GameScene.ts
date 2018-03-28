import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";

export default class GameScene extends Scene {
    private camera: BABYLON.FreeCamera

    onCreate() {
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero())
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)
        const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene, false, BABYLON.Mesh.FRONTSIDE)
        sphere.position.y = 1

        sphere.actionManager = new BABYLON.ActionManager(this.scene);

        sphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    console.log('Kliknięto!')
                    this.game.switchScene(PlaygroundScene)
                }
            )
        );
        const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false)        
    }

    onUpdate() {

    }

    onDestroy() {

    }
}