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
    public shadowGenerator: BABYLON.ShadowGenerator

    async onCreate() {
        this.scene.enablePhysics(BABYLON.Vector3.Zero());
        //let music = new BABYLON.Sound("Ambient", "/assets/Ambient.ogg", this.scene, null, { loop: true, autoplay: true });

        await this.preloadAssets({
            Bush: "Bush2.babylon",
            Tree: "Tree1.babylon",
            Base: "baseCenter.babylon",
            Enemy: "Enemy.babylon",
            StickmanEnemy: "StickmanEnemy.babylon"
        }, {
                Particle: "Particle.png"
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
        this.scene.beginAnimation(base.getChildMeshes()[0], 0, 300, true)

        this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 20, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.game.getCanvas(), false)

        const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.5;
        light.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5)
        light.specular = new BABYLON.Color3(0, 0, 0);

        const directionalLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 1), this.scene)
        directionalLight.specular = new BABYLON.Color3(0, 0, 0)
        directionalLight.diffuse = new BABYLON.Color3(1, 1, 1)
        directionalLight.intensity = 1
        directionalLight.position = new Vector3(10, 10, 10)
        directionalLight.shadowMinZ = 1;
        directionalLight.shadowMaxZ = 20


        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
        this.shadowGenerator.useBlurCloseExponentialShadowMap = true;
        this.shadowGenerator.forceBackFacesOnly = true;

        this.shadowGenerator.addShadowCaster(tree)
        this.shadowGenerator.addShadowCaster(bush1)
        this.shadowGenerator.addShadowCaster(bush2)
        this.shadowGenerator.addShadowCaster(base)

        const ground = BABYLON.Mesh.CreateGround('Ground', 50, 30, 10, this.scene, false);
        ground.position = Vector3.Zero();
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.9 }, this.scene);
        ground.receiveShadows = true;

        var grassMaterial = new BABYLON.StandardMaterial("Grass", this.scene);
        grassMaterial.alpha = 1;
        grassMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = grassMaterial;

        //this.scene.debugLayer.show();

        this.scene.onPointerDown = event => {
            const pickResult = this.scene.pick(this.scene.unTranslatedPointer.x, this.scene.unTranslatedPointer.y);
            if (pickResult.hit) {
                this.shoot(pickResult.pickedPoint)
            }
        }

    }
    registeredFunction: Function
    shoot(point: Vector3) {
        const direction = point.subtract(new Vector3(6, 3, 0)).normalize().multiply(new Vector3(32, 32, 32))
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
            enemySystem.hitEnemy((collidedAgaints.object as any).parentEntity, 25, collider.getObjectCenter())
            this.explode(collider.getObjectCenter())
            this.disposeEntity((collider.object as any).parentEntity)
            entity.mesh.physicsImpostor.unregisterOnPhysicsCollide(impostors, hitCallback)
        }
        entity.mesh.physicsImpostor.registerOnPhysicsCollide(impostors, hitCallback)

        this.game.addEntityToSystem(entity, MovingSystem);
    }

    explode(position: Vector3) {

        const systemName = "particles" + (new Date).getTime();
        const particleSystem = new BABYLON.ParticleSystem(name, 10, this.scene);
        particleSystem.minEmitPower = 10;
        particleSystem.maxEmitPower = 10;
        particleSystem.particleTexture = this.game.getTextureData("Particle")
        particleSystem.emitter = position.add(new Vector3(0.5, 0, 0))
        particleSystem.gravity = new Vector3(0, 10, 0)
        particleSystem.start()
        setTimeout(() => {
            particleSystem.stop()
        }, 500)
        setTimeout(() => {
            particleSystem.dispose(false)
        }, 3000)
    }

    onUpdate() { }

    onDestroy() { }
}