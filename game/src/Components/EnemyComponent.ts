import Component from "../Engine/Component";
import { Vector3 } from "babylonjs";

export default class EnemyComponent extends Component {

    public maxHealth: number
    public isKilled: boolean = false

    public get healthFactor() {
        return this.health / this.maxHealth
    }

    constructor(public health: number = 100) {
        super()
        this.maxHealth = health
    }
}