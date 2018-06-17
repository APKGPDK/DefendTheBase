import Scene from "../Engine/Scene";
import PlaygroundScene from "./PlaygroundScene";
import { MeshAssets } from "../MeshAssets";
import Entity from "../Engine/Entity";
import MovingSystem from "../Systems/MovingSystem";
import MovementComponent from "../Components/MovementComponent";
import { Vector3, PhysicsImpostor, Mesh, Color3, DirectionalLight } from "babylonjs";
import EnemySystem from "../Systems/EnemySystem";
import HUDSystem from "../Systems/HUDSystem";

export default class GameScene extends Scene {
    private camera: BABYLON.UniversalCamera
    public shadowGenerator: BABYLON.ShadowGenerator

    directionalLight: DirectionalLight

    base: Mesh

    async onCreate() {
        const hudSystem = this.game.getSystem(HUDSystem);
        this.scene.enablePhysics(BABYLON.Vector3.Zero());

        let music = new BABYLON.Sound("Ambient", "/assets/Ambient.ogg", this.scene, null, { loop: true, autoplay: true });

        await this.preloadAssets({
            Bush: "Bush2.babylon",
            Tree: "Tree1.babylon",
            Rock1: "Rock1.babylon",
            Rock2: "Rock2.babylon",
            Base: "baseCenter.babylon",
            Enemy: "Enemy.babylon",
            StickmanEnemy: "StickmanEnemy.babylon",
            Wall: "Wall.babylon"
        }, {
                Particle: "Particle.png"
            })

        this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 20, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.game.getCanvas(), false)
        this.setupLights()

        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.directionalLight);
        this.shadowGenerator.useBlurCloseExponentialShadowMap = true;
        this.shadowGenerator.forceBackFacesOnly = true;

        this.addGround();
        this.generateAmbient();
        this.addBase();
        this.buildWalls();

        this.scene.onPointerDown = event => {
            const pickResult = this.scene.pick(this.scene.unTranslatedPointer.x, this.scene.unTranslatedPointer.y);
            if (pickResult.hit) {
                this.shoot(pickResult.pickedPoint)
            }
        }

        hudSystem.hideMenu();
        hudSystem.hideGameOver();
    }

    registeredFunction: Function
    shoot(point: Vector3) {
        const direction = point.subtract(new Vector3(6, 5, 0)).normalize().multiply(new Vector3(32, 32, 32))
        let entity = this.createEntity({
            name: "Bullet",
            meshName: "Enemy",
            position: new Vector3(6, 5, 0),
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
            enemySystem.hitEnemy((collidedAgaints.object as any).parentEntity, 25, collider.getObjectCenter()) // mnoznik do obrazen za ulepszenia
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

    generateAmbient() {
        for (var i = 0; i < 30; i++) {
            var l = i % 20;
            const bush = this.createMesh({
                meshName: 'Bush',
                name: 'Bush',
                position: new BABYLON.Vector3(-8 + Math.ceil(Math.random() * 5 - 4 + l), 0, 8 + Math.ceil(Math.random() * 6 - 5)),
                rotation: new Vector3(0, Math.ceil(Math.random() * 10 - 5), 0)
            })
            
            this.shadowGenerator.addShadowCaster(bush)
        }

        for (var i = 0; i < 35; i++) {
            //if(i>19)
            var l = i % 20;

            const tree = this.createMesh({
                meshName: 'Tree',
                name: 'Tree',
                position: new BABYLON.Vector3(-8 + Math.ceil(Math.random() * 5 - 4 + l), 0, 12 + Math.ceil(Math.random() * 6 - 5)),
                rotation: new Vector3(0, Math.ceil(Math.random() * 10 - 5), 0)
            })
            this.shadowGenerator.addShadowCaster(tree)
        }
    }

    setupLights() {
        const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.5;
        light.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5)
        light.specular = new BABYLON.Color3(0, 0, 0);

        this.directionalLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0.5), this.scene)
        this.directionalLight.specular = new BABYLON.Color3(0, 0, 0)
        this.directionalLight.diffuse = new BABYLON.Color3(1, 1, 1)
        this.directionalLight.intensity = 1
        this.directionalLight.position = new Vector3(10, 10, 10)
        this.directionalLight.shadowMinZ = 0;
        this.directionalLight.shadowMaxZ = 20
    }

    addGround() {
        const ground = BABYLON.Mesh.CreateGround('Ground', 50, 30, 10, this.scene, false);
        ground.position = Vector3.Zero();
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.9 }, this.scene);
        ground.receiveShadows = true;

        var grassMaterial = new BABYLON.StandardMaterial("Grass", this.scene);
        grassMaterial.alpha = 1;
        grassMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = grassMaterial;
    }

    addBase() {
        this.base = this.createMesh({
            meshName: 'Base',
            name: "Base",
            position: new BABYLON.Vector3(6, 0, 0),
            scaling: new Vector3(0.75, 0.75, 0.75)
        })
        this.scene.beginAnimation(this.base.getChildMeshes()[0], 0, 300, true);

        for (var i = 1; i < 7; i++) { // color base foundation
            this.base.getChildMeshes()[i].material = new BABYLON.StandardMaterial("BaseFoundationMaterial", this.scene);
            (<BABYLON.StandardMaterial>this.base.getChildMeshes()[i].material).diffuseColor = new Color3(0.8, 0.8, 0.8);
        }

        // color base orb
        this.base.getChildMeshes()[0].material = new BABYLON.StandardMaterial("BaseOrbMaterial", this.scene);
        (<BABYLON.StandardMaterial>this.base.getChildMeshes()[0].material).diffuseColor = new Color3(1, 1, 0);
        this.shadowGenerator.addShadowCaster(this.base)
    }

    buildWalls() {
        for (let i = -2; i <= 2; i++) {
            const wall = this.createMesh({
                meshName: 'Wall',
                name: 'Wall',
                position: new Vector3(5 - Math.cos(i), -Math.random(), i*2)
            })
            wall.setEnabled(false);
            this.shadowGenerator.addShadowCaster(wall)
        }
    }
}