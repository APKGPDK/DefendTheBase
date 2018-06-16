import System from "../Engine/System";
import MovementComponent from "../Components/MovementComponent";

export default class HUDSystem extends System {

    private properties: { [key: string]: string | number } = {
        hp: "123",
        wave: "10",
        cash: "499"
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
}