import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";
import { MeshAssets } from "../MeshAssets";
import Entity from "../Engine/Entity";
import MovingSystem from "../Systems/MovingSystem";
import MovementComponent from "../Components/MovementComponent";
import { Vector3 } from "babylonjs";

export default class GameScene extends Scene {
    private camera: BABYLON.UniversalCamera
    private enemy: Entity
    private hp: number
    private killed: boolean

    async onCreate() {
        this.scene.enablePhysics(BABYLON.Vector3.Zero());

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
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);

        var grassMaterial = new BABYLON.StandardMaterial("Grass", this.scene);
        grassMaterial.alpha = 1;
        grassMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = grassMaterial;

        this.scene.debugLayer.show();


        this.createEnemy();
        this.hp = 100;

        this.scene.onPointerDown = event => {
            const pickResult = this.scene.pick(this.scene.unTranslatedPointer.x, this.scene.unTranslatedPointer.y);
            if (pickResult.hit) {
                this.shoot(pickResult.pickedPoint)
            }
        }

    }

    shoot(point: Vector3) {
        const direction = point.subtract(new Vector3(6, 3, 0)).divide(new Vector3(64, 64, 64))
        let entity = this.createEntity({
            name: "Bullet",
            meshName: "Enemy",
            position: new Vector3(6, 3, 0),
            scaling: new Vector3(0.1, 0.1, 0.1)
        });
        entity.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(entity.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, this.scene);
        entity.mesh.physicsImpostor.registerOnPhysicsCollide(this.enemy.mesh.physicsImpostor, (collider, collidedAgaints) => {
            collidedAgaints.setMass(1);
            this.disposeEntity((collider.object as any).parentEntity)
            this.disposeEntity((collidedAgaints.object as any).parentEntity)
            if(!this.killed) {
                console.log('Enemy destroyed!')
                this.killed = true;
                setTimeout(() => this.createEnemy())
            }
        })
        entity.addComponent(new MovementComponent(direction));
        this.game.addEntityToSystem(entity, MovingSystem);
    }

    createEnemy() {
        this.enemy = this.createEntity({
            name: "Enemy",
            meshName: "Enemy",
            position: new Vector3(-8, 0.5, 0),
            scaling: new Vector3(0.5, 0.5, 0.5)
        });
        this.enemy.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.enemy.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, this.scene).sleep()
        this.enemy.addComponent(new MovementComponent(new Vector3(1, 0, 0).divide(new Vector3(64, 64, 64))));
        this.game.addEntityToSystem(this.enemy, MovingSystem);

        this.killed = false;
        /*this.enemy.actionManager = new BABYLON.ActionManager(this.scene);
        this.enemy.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnLeftPickTrigger,
            () => {
                //console.log('Enemy destroyed!')
                this.enemy.dispose();
                this.killed = true;
                this.enemy.position = new Vector3(-4, 0.5, 0);
                this.createEnemy();
            }
        ));*/
    }

    onUpdate() {
        if (this.enemy) {
            if(this.enemy.mesh.position.x > 4) {
                this.enemy.getComponent(MovementComponent).velocity = BABYLON.Vector3.Zero()
            }
            if (!this.killed && this.enemy.mesh.position.x < 4) {
                // this.enemy.mesh.position.x += 0.1;

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