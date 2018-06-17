import System from "../Engine/System";
import EnemyComponent from "../Components/EnemyComponent";
import { Vector3 } from "babylonjs";
import Entity from "../Engine/Entity";
import GameScene from "../Scenes/GameScene";
import BaseSystem from "./BaseSystem";
import HUDSystem from "./HUDSystem";

export default class EnemySystem extends System {
    lastSpawnAt: number = null;
    enemiesCount: number = 0;
    private baseSystem: BaseSystem;
    private hudSystem: HUDSystem;
    currentWave: number = 0;
    healthBonus: number = 0;
    // punching, kicking, bomb

    waveData = [
        [10, 0, 0],
        [6, 4, 0],
        [Math.ceil(Math.random() * 15 - 5), 5, 0],
        [10, 5, 1],
        [20, 10, 2],
        [0, 0, 10]
    ];
    // [Math.ceil(Math.random() * 10 - 5)],
    // [Math.ceil(Math.random() * 10 - 5)],
    // [Math.ceil(Math.random() * 10 - 5)],
    // [Math.ceil(Math.random() * 10 - 5)]];

    onStart() {
        this.baseSystem = this.game.getSystem(BaseSystem);
        this.hudSystem = this.game.getSystem(HUDSystem);
    }

    onUpdate(): void {
        this.hudSystem.setProperty('wave', this.currentWave + 1);
        if (this.game.timeManager.getElapsedMiliseconds() > this.lastSpawnAt + 1500) {

            if (this.waveData[this.currentWave][0] > 0) {
                this.spawnEnemy("punchingEnemy", "StickmanEnemy")
                this.waveData[this.currentWave][0]--
            }

            if (this.waveData[this.currentWave][1] > 0) {
                this.spawnEnemy("kickingEnemy", "StickmanEnemy")
                this.waveData[this.currentWave][1]--
            }

            if(this.waveData[this.currentWave][2] > 0){
                this.spawnEnemy("BombEnemy", "BombEnemy")
                this.waveData[this.currentWave][2]--
            }

            if (this.waveData[this.currentWave][0] == 0 && this.waveData[this.currentWave][1] == 0 && this.waveData[this.currentWave][2] == 0 && this.enemiesCount == 0) {
                this.currentWave++
                this.healthBonus += 25;
            }
        }
        this.entities.forEach(enemy => {
            if (enemy.mesh.position.x > 4 - Math.cos(enemy.mesh.position.z / 2)) {
                enemy.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())

                if (enemy.animations.walk) {
                    enemy.animations.walk.stop();
                    enemy.animations.walk = void 0;

                    const enemyData = enemy.getComponent(EnemyComponent)

                    if (enemyData.type == "kickingEnemy")
                        enemy.mesh.skeleton.beginAnimation('KickingAttackAnimation', true)

                    if (enemyData.type == "punchingEnemy")
                        enemy.mesh.skeleton.beginAnimation('PunchingAttackAnimation', true)
                }

                this.handleAttack(enemy);
            }

            this.deleteIfGarbage(enemy);
        })
    }

    spawnEnemy(enemyType: string, meshName: string) {
        this.enemiesCount++;
        this.lastSpawnAt = this.game.timeManager.getElapsedMiliseconds()
        const currentScene = this.game.getCurrentScene();

        const startHealth = 3 + this.healthBonus;
        const enemyData = new EnemyComponent(startHealth, enemyType, this.currentWave + 1) // typy zaleznie od fali

        var scale = new Vector3(0.65, 0.65, 0.65);
        var pos = new Vector3(-16, 0.6, Math.ceil(Math.random() * 10 - 5));

        if(meshName == "StickmanEnemy"){
            scale = new Vector3(0.25, 0.25, 0.25);  
            pos = new Vector3(-16, 1.4, Math.ceil(Math.random() * 10 - 5));
        }
          
        const enemy = currentScene.createEntity({
            name: "Enemy",
            meshName,
            position: pos,
            scaling: scale,
            rotation: new Vector3(0, 30, 0)
        });

        enemy.mesh = enemy.mesh.convertToFlatShadedMesh()
        if(meshName != "BombEnemy"){
            enemy.animations.walk = enemy.mesh.skeleton.beginAnimation('WalkingAnimation', true);
        } else{
           currentScene.scene.beginDirectAnimation(enemy.mesh,  [enemy.mesh.animations[0]],  0, 250, true);
        }

        const material = new BABYLON.StandardMaterial('enemyMaterial', this.game.getCurrentScene().scene);
        material.diffuseColor = this.getColorByHealthFactor(enemyData.healthFactor)
        enemy.mesh.material = material;
        enemy.mesh.receiveShadows = true;

        (this.game.getCurrentScene() as GameScene).shadowGenerator.addShadowCaster(enemy.mesh)

        this.game.getCurrentScene().setPhysicsImpostor(enemy, {
            type: BABYLON.PhysicsImpostor.BoxImpostor,
            options: {
                mass: 1,
                restitution: 0.9
            }
        });
        enemy.mesh.physicsImpostor.physicsBody.collisionResponse = false
        enemy.mesh.physicsImpostor.setLinearVelocity(new Vector3(1, 0, 0))

        enemy.addComponent(enemyData)

        enemy.markSystem((this as any).constructor)
        this.add(enemy)
    }

    hitEnemy(enemy: Entity, damage: number, position: Vector3) {
        const enemyData = enemy.getComponent(EnemyComponent)
        if (!enemyData.isKilled) {
            enemyData.health -= damage;
            (<BABYLON.StandardMaterial>enemy.mesh.material).diffuseColor = this.getColorByHealthFactor(enemyData.healthFactor)
            enemy.mesh.material.markDirty()

            if (enemyData.health <= 0) {
                this.markEnemyAsKilled(enemy)
                enemy.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
                enemy.mesh.physicsImpostor.applyImpulse(new Vector3(-1, Math.random(), Math.random() - 0.5).multiplyByFloats(10, 10, 10), position)
            }
        }
    }

    markEnemyAsKilled(enemy: Entity) {
        const enemyData = enemy.getComponent(EnemyComponent)
        if (!enemyData.isKilled) {
            this.baseSystem.addCash(10 + this.currentWave * 5);
            enemyData.isKilled = true;
            this.enemiesCount--;
        }
    }

    deleteIfGarbage(enemy: Entity) {
        const enemyData = enemy.getComponent(EnemyComponent)
        const distance = enemy.mesh.position.length()
        if (distance > 20) {
            (this.game.getCurrentScene() as GameScene).shadowGenerator.removeShadowCaster(enemy.mesh)
        }
        if (distance > 100) {
            this.markEnemyAsKilled(enemy)
            this.game.getCurrentScene().disposeEntity(enemy)
        }

    }

    getColorByHealthFactor(healthFactor: number) {
        /*const red = healthFactor <= 0.5 ? 1 : 2 - healthFactor * 2
        const green = healthFactor >= 0.5 ? 1 : healthFactor * 2
        const color = new BABYLON.Color3(red, green, 0);
        */
        return new BABYLON.Color3(1, healthFactor, healthFactor)
    }

    handleAttack(enemy: Entity) {

        const enemyData = enemy.getComponent(EnemyComponent)
        const currentElapsedTime = this.game.timeManager.getElapsedMiliseconds()
        if (+enemyData.lastAttackAt < currentElapsedTime - enemyData.attackInterval) {
            enemyData.lastAttackAt = currentElapsedTime;
            this.baseSystem.hurtBase(enemyData.damage);
        }
    }
}