import System from "../Engine/System";
import MovementComponent from "../Components/MovementComponent";
import { Vector3 } from "babylonjs";

export default class MovingSystem extends System {
    onUpdate(): void {
        this.entities.forEach(entity => {
            const movementComponent = entity.getComponent(MovementComponent)
            if (movementComponent) {
                //if (entity.mesh.physicsImpostor) {
                    //entity.mesh.physicsImpostor.applyImpulse(entity.getComponent(MovementComponent).velocity, entity.mesh.getAbsolutePosition())
                    //console.log(movementComponent.velocity)
                   // entity.mesh.physicsImpostor.setLinearVelocity(movementComponent.velocity)
                //} else {
                    entity.mesh.position = entity.mesh.position.add(movementComponent.velocity)
                //}
            }
        })
    }
}