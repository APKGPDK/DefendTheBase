import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";
import { MeshAssets } from "../MeshAssets";

export default class GameScene extends Scene {
    private camera: BABYLON.UniversalCamera
    private enemy: BABYLON.AbstractMesh
    private hp: number
    private killed: boolean

    async onCreate() {
        await this.preloadAssets({
            Bush: "Bush2.babylon",
            Tree: "Tree1.babylon",
            Base: "Base.babylon",
            Enemy: "Enemy.babylon"
        })

        const bush1 = this.createMesh({
            meshName: 'Bush',
            name: 'Bush',
            position: new BABYLON.Vector3(3, 0, 3)
        })

        const bush2 = this.createMesh({
            meshName: 'Bush',
            name: 'Bush',
            position: new BABYLON.Vector3(-2, 0, 2)
        })

        const tree = this.createMesh({
            meshName: 'Tree',
            name: 'Tree',
            position: new BABYLON.Vector3(0, 0, 4)
        })

        const base = this.createMesh({
            meshName: 'Base',
            name: "Base",
            position: new BABYLON.Vector3(6, 0, 0)
        })
        this.scene.beginAnimation(base.getChildMeshes()[1], 0, 300, true)

        this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 3, -9), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.game.getCanvas(), false)
        const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 10, 3), this.scene);
        light.intensity = 5;
        light.specular = new BABYLON.Color3(0, 0, 0);

        const ground = BABYLON.Mesh.CreateGround('Ground', 50, 30, 10, this.scene, false);

        var grassMaterial = new BABYLON.StandardMaterial("Grass", this.scene);
        grassMaterial.alpha = 1;
        grassMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = grassMaterial;

        this.scene.debugLayer.show();


        this.createEnemy();
        this.hp = 100;

    }

    createEnemy() {
        this.killed = false;
        this.enemy = this.createMesh({
            name: "KK",
            meshName: "Enemy",
            position: new BABYLON.Vector3(-8, 0.5, 0)
        })
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
    }

    onUpdate() {
        if (this.enemy) {
            if (!this.killed && this.enemy.position.x < 4) {
                this.enemy.position.x += 0.1;

            } else if (!this.killed) {
                console.log("Your base got hit!");
                this.hp--;
                if (!this.hp)
                    console.log("Your base got destroyed!");
            }
        }

    }

    onDestroy() {

    }
}