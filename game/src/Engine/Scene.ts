import Game from './Game';

export default class Scene {
    protected scene: BABYLON.Scene

    constructor(protected game: Game) {
        this.scene = new BABYLON.Scene(game.getEngine())
    }

    create() {
        this.onCreate()
    }

    update() {
        this.onUpdate()
        this.scene.render()
    }

    destroy() {
        this.onDestroy()
    }

    onCreate() { }
    onUpdate() { }
    onDestroy() { }
}