import Component from "./Component";
import { Mesh, Animatable } from "babylonjs";
import System from "./System";

export default class Entity {
    components: {
        [key: string]: Component
    } = {};

    systems: typeof System[] = []

    animations : {[key:string]:Animatable} = {}

    constructor(public mesh: Mesh) {

    }

    addComponent(component: Component) {
        this.components[component.constructor.name] = component;
    }

    getComponent<T>(componentType: new () => T): T {
        return this.components[componentType.name] as T;
    }

    markSystem(systemName: typeof System) {
        this.systems.push(systemName)
    }

    unmarkSystem(systemName: typeof System) {
        this.systems = this.systems.filter(system => system != systemName)
    }

    dispose() {
        setTimeout(() => this.mesh.dispose())
    }
}