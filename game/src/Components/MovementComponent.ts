import Component from "../Engine/Component";
import { Vector3 } from "babylonjs";

export default class MovementComponent extends Component {

    constructor(public velocity: Vector3 = new Vector3(0, 0, 0)) {
        super()
    }
}