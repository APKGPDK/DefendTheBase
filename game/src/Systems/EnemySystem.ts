import System from "../Engine/System";
import EnemyComponent from "../Components/EnemyComponent";
import { Vector3 } from "babylonjs";
import Entity from "../Engine/Entity";
import GameScene from "../Scenes/GameScene";

export default class EnemySystem extends System {
    lastSpawnAt: number = null;

    enemiesCount: number = 0;
    maxEnemiesCount: number = 10;

    onStart() {

    }

    onUpdate(): void {
        if (this.game.timeManager.getElapsedMiliseconds() > this.lastSpawnAt + 1500) {
            this.spawnEnemy()
        }
        this.entities.forEach(enemy => {
            if (enemy.mesh.position.x > 4) {
                enemy.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())

                if(enemy.animations.walk){
                    enemy.animations.walk.stop();
                    enemy.animations.walk = void 0;
                    enemy.mesh.skeleton.beginAnimation('PunchingAttackAnimation', true)
                }
                
                //enemy.mesh.skeleton.beginAnimation('PunchingAttackAnimation', true)
                
            }

            this.deleteIfGarbage(enemy);
        })
    }

    spawnEnemy() {
        if (this.maxEnemiesCount <= this.enemiesCount) return;
        this.enemiesCount++;

        this.lastSpawnAt = this.game.timeManager.getElapsedMiliseconds()

        const currentScene = this.game.getCurrentScene();

        const startHealth = 100
        const enemyData = new EnemyComponent(startHealth)
        const enemy = currentScene.createEntity({
            name: "StickmanEnemy",
            meshName: "StickmanEnemy",
            position: new Vector3(-16, 1.4, Math.ceil(Math.random() * 10 - 5)),
            scaling: new Vector3(0.25, 0.25, 0.25),
            rotation: new Vector3(0, 30, 0)
        });

        enemy.mesh = enemy.mesh.convertToFlatShadedMesh()
        //console.log(enemy.mesh.animations);
        enemy.animations.walk = enemy.mesh.skeleton.beginAnimation('WalkingAnimation', true)
        //const animation = currentScene.scene.beginAnimation(enemy.mesh.skeleton, 140, 220, true);

      //  animation.stop();

        const material = new BABYLON.StandardMaterial('enemyMaterial', this.game.getCurrentScene().scene)
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
            enemyData.isKilled = true
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
}