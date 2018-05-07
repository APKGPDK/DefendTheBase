import Game from "./Game";
import Entity from "./Entity";

export interface SystemInterface {
    onStart(): void;
    onUpdate(): void;
}

export default abstract class System implements SystemInterface {
    entities: Entity[] = [];

    constructor(protected game: Game) {

    }

    start() {
        this.onStart()
    }

    update() {
        this.onUpdate()
    }

    onStart() { }
    abstract onUpdate(): void;

    add(entity: Entity) {
        this.entities.push(entity);
    }
}