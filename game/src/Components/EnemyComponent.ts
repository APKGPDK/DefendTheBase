import Component from "../Engine/Component";
import { Vector3 } from "babylonjs";

export default class EnemyComponent extends Component {

    public maxHealth: number
    public isKilled: boolean = false
    public enemyType: string

    public get healthFactor() {
        return this.health / this.maxHealth
    }

    constructor(public health: number = 100, public type : string = "") { // zaleznie od fali wyzszy
        super()
        this.maxHealth = health
        this.enemyType = type
    }
}