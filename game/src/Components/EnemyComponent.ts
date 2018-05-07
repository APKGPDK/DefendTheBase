import Component from "../Engine/Component";
import { Vector3 } from "babylonjs";

export default class EnemyComponent extends Component {

    public isKilled: boolean = false

    constructor(public health: number = 100) {
        super()
    }
}