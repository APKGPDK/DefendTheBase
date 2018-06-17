import System from "../Engine/System";
import HUDSystem from "./HUDSystem";

export default class BaseSystem extends System {

    private cash = 0;
    private health = 10000;

    private hudSystem: HUDSystem

    onStart(): void {
        this.hudSystem = this.game.getSystem(HUDSystem);
    }

    onUpdate(): void {
        this.hudSystem.setProperty('cash', this.cash);
        this.hudSystem.setProperty('hp', this.health);
    }

    addCash(value: number) {
        this.cash += value;
    }

    subtractCash(value: number) {
        this.cash = Math.max(0, this.cash - value);
    }

    hurtBase(value: number) {
        this.health = Math.max(0, this.health - value);
        if(this.health == 0) {
            this.hudSystem.showGameOver();
        }
    }
}