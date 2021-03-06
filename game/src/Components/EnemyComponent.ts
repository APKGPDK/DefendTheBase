import Component from "../Engine/Component";
import { Vector3 } from "babylonjs";

export default class EnemyComponent extends Component {

    public maxHealth: number
    public isKilled: boolean = false
    public enemyType: string

    public lastAttackAt: number = 0

    public get healthFactor() {
        return this.health / this.maxHealth
    }

    constructor(public health: number = 3, public type : string = "", public damage: number = 1, public attackInterval: number = 1000) { // zaleznie od fali wyzszy
        super()
        this.maxHealth = health
        this.enemyType = type
    }
}