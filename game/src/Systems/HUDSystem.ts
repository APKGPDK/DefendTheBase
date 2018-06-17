import System from "../Engine/System";
import MovementComponent from "../Components/MovementComponent";

export default class HUDSystem extends System {

    private properties: { [key: string]: string | number } = {
        wave: "10",
    }

    onUpdate(): void {
        for (let key in this.properties) {
            this.updateView(key);
        }
    }

    private updateView(key: string) {
        document.getElementById(`${key}_value`).innerText = this.properties[key].toString();
    }

    setProperty(key: string, value: string | number) {
        this.properties[key] = value;
    }

    showGameOver() {
        document.getElementById('gameover').classList.add('visible');
    }

    hideGameOver() {
        document.getElementById('gameover').classList.remove('visible');
    }

    hideMenu() {
        document.getElementById('menu').classList.add('hidden');
    }
}