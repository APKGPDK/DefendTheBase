import System from "../Engine/System";
import HUDSystem from "./HUDSystem";
import GameScene from "../Scenes/GameScene";

export default class BaseSystem extends System {
    
    private cash = 0;
    private health = 100;

    private hudSystem: HUDSystem

    wallsLevel = 0;
    energyLevel = 0;

    onStart(): void {
        this.hudSystem = this.game.getSystem(HUDSystem);
    }

    onUpdate(): void {
        this.hudSystem.setProperty('cash', this.cash);
        this.hudSystem.setProperty('hp', this.health);
        this.hudSystem.setProperty('wall', this.getNextWallsPrice());
        this.hudSystem.setProperty('warehouse', this.getNextWarehousesPrice());
    }

    addCash(value: number) {
        this.cash += value;
    }

    subtractCash(value: number) {
        this.cash = Math.max(0, this.cash - value);
    }

    hurtBase(value: number) {
        this.health = Math.max(0, this.health - value);
        if (this.health == 0) {
            this.hudSystem.showGameOver();
        }
    }

    getNextWallsPrice() {
        return (this.wallsLevel + 1) * 100;
    }

    upgradeWalls() {
        const nextLevelPrice = this.getNextWallsPrice();
        if (nextLevelPrice <= this.cash) {
            const currentScene = this.game.getCurrentScene() as GameScene;
            if (this.wallsLevel < currentScene.walls.length) {
                currentScene.walls[this.wallsLevel].setEnabled(true);
            }

            this.cash -= nextLevelPrice;
            this.wallsLevel++;
            this.health = (this.wallsLevel + 1) * 100;
        }
    }

    getNextWarehousesPrice() {
        return (this.energyLevel + 1) * 200;
    }

    upgradeWarehouses() {
        const nextLevelPrice = this.getNextWarehousesPrice();
        if (nextLevelPrice <= this.cash) {
            const currentScene = this.game.getCurrentScene() as GameScene;
            if (this.energyLevel < currentScene.buildings.length) {
                currentScene.buildings[this.energyLevel].setEnabled(true);
            }

            this.cash -= nextLevelPrice;
            this.energyLevel++;
        }
    }

    getDamage() {
        return this.energyLevel + 1;
    }
}