import Game from "./Game";
import Entity from "./Entity";

export interface SystemInterface {
    onUpdate(): void;
}

export default abstract class System implements SystemInterface {
    entities: Entity[] = [];

    constructor(protected game: Game) {

    }

    update() {
        this.onUpdate()
    }

    abstract onUpdate(): void;

    add(entity: Entity) {
        this.entities.push(entity);
    }
}