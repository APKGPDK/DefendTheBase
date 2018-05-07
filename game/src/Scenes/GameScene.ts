import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";
import { MeshAssets } from "../MeshAssets";
import Entity from "../Engine/Entity";
import MovingSystem from "../Systems/MovingSystem";
import MovementComponent from "../Components/MovementComponent";
import { Vector3, PhysicsImpostor, Mesh } from "babylonjs";
import EnemySystem from "../Systems/EnemySystem";

export default class GameScene extends Scene {
    private camera: BABYLON.UniversalCamera

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

        var ssaoRatio = {
            ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
            combineRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
        };

        var ssao = new BABYLON.SSAORenderingPipeline("ssao", this.scene, ssaoRatio);
        ssao.fallOff = 0.000001;
        ssao.area = 1;
        ssao.radius = 0.0001;
        ssao.totalStrength = 1.0;
        ssao.base = 0.5;

        // Attach camera to the SSAO render pipeline
        this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", this.camera);

        const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 10, 3), this.scene);
        light.intensity = 5;
        light.specular = new BABYLON.Color3(0, 0, 0);

        const ground = BABYLON.Mesh.CreateGround('Ground', 50, 30, 10, this.scene, false);
        ground.position = Vector3.Zero();
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.9 }, this.scene);

        var grassMaterial = new BABYLON.StandardMaterial("Grass", this.scene);
        grassMaterial.alpha = 1;
        grassMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = grassMaterial;

        this.scene.debugLayer.show();

        this.scene.onPointerDown = event => {
            const pickResult = this.scene.pick(this.scene.unTranslatedPointer.x, this.scene.unTranslatedPointer.y);
            if (pickResult.hit) {
                this.shoot(pickResult.pickedPoint)
            }
        }

    }
    registeredFunction: Function
    shoot(point: Vector3) {
        const direction = point.subtract(new Vector3(6, 3, 0)).normalize().multiply(new Vector3(64, 64, 64))
        let entity = this.createEntity({
            name: "Bullet",
            meshName: "Enemy",
            position: new Vector3(6, 3, 0),
            scaling: new Vector3(0.1, 0.1, 0.1)
        });
        entity.addComponent(new MovementComponent(direction));
        entity.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(entity.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, this.scene);
        entity.mesh.physicsImpostor.physicsBody.collisionResponse = false
        entity.mesh.physicsImpostor.setLinearVelocity(direction)

        const enemySystem = this.game.getSystem(EnemySystem)
        const impostors = enemySystem.entities.map(enemy => enemy.mesh.physicsImpostor)
        const hitCallback = (collider: BABYLON.PhysicsImpostor, collidedAgaints: BABYLON.PhysicsImpostor) => {
            (collider.object as Mesh).visibility = 0
            enemySystem.hitEnemy((collidedAgaints.object as any).parentEntity, 50, collider.getObjectCenter())
            this.disposeEntity((collider.object as any).parentEntity)
            //this.disposeEntity((collidedAgaints.object as any).parentEntity)
            entity.mesh.physicsImpostor.unregisterOnPhysicsCollide(impostors, hitCallback)
        }
        entity.mesh.physicsImpostor.registerOnPhysicsCollide(impostors, hitCallback)

        this.game.addEntityToSystem(entity, MovingSystem);
    }

    onUpdate() { }

    onDestroy() { }
}