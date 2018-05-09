import System from "../Engine/System";
import MovementComponent from "../Components/MovementComponent";
import { Vector3 } from "babylonjs";

export default class MovingSystem extends System {
    onUpdate(): void {
        this.entities.forEach(entity => {
            const movementComponent = entity.getComponent(MovementComponent)
            if (movementComponent) {
                if (!entity.mesh.physicsImpostor) {
                    entity.mesh.position = entity.mesh.position.add(movementComponent.velocity)
                }
            }
        })
    }
}