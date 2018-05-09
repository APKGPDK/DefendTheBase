import System from "../Engine/System";
import EnemyComponent from "../Components/EnemyComponent";
import { Vector3 } from "babylonjs";
import Entity from "../Engine/Entity";

export default class EnemySystem extends System {
    lastSpawnAt: number = null;

    onStart() {

    }

    onUpdate(): void {
        if (this.game.timeManager.getElapsedMiliseconds() > this.lastSpawnAt + 1500) {
            this.spawnEnemy()
        }
        this.entities.forEach(enemy => {
            if (enemy.mesh.position.x > 4) {
                enemy.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
            }
        })
    }

    spawnEnemy() {
        this.lastSpawnAt = this.game.timeManager.getElapsedMiliseconds()

        const enemy = this.game.getCurrentScene().createEntity({
            name: "Enemy",
            meshName: "Enemy",
            position: new Vector3(-16, 0.5, Math.ceil(Math.random() * 10 - 5)),
            scaling: new Vector3(0.5, 0.5, 0.5)
        });
        this.game.getCurrentScene().setPhysicsImpostor(enemy, {
            type: BABYLON.PhysicsImpostor.BoxImpostor,
            options: {
                mass: 1,
                restitution: 0.9
            }
        });
        enemy.mesh.physicsImpostor.physicsBody.collisionResponse = false
        enemy.mesh.physicsImpostor.setLinearVelocity(new Vector3(1, 0, 0))

        enemy.addComponent(new EnemyComponent(100))

        enemy.markSystem((this as any).constructor)
        this.add(enemy)
    }

    hitEnemy(enemy: Entity, damage: number, position: Vector3) {
        const enemyData = enemy.getComponent(EnemyComponent)
        if (!enemyData.isKilled) {
            enemyData.health -= damage

            if (enemyData.health <= 0) {
                enemyData.isKilled = true;
                enemy.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
                enemy.mesh.physicsImpostor.applyImpulse(new Vector3(-1, Math.random(), Math.random() - 0.5).multiplyByFloats(10, 10, 10), position)
            }
        }
    }


}