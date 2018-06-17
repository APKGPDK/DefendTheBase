import Game from './Engine/Game';
import './polyfills.ts';
import GameScene from './Scenes/GameScene';
import './style.css';
import EnemySystem from './Systems/EnemySystem';
import HUDSystem from './Systems/HUDSystem';
import MovingSystem from './Systems/MovingSystem';
import BaseSystem from './Systems/BaseSystem';

const canvas = <HTMLCanvasElement>document.getElementById('game');

const game = new Game(canvas);
const global = (window as any);
game.registerSystem(MovingSystem);
game.registerSystem(EnemySystem);
game.registerSystem(HUDSystem);
const baseSystem = game.registerSystem(BaseSystem) as BaseSystem;

global.startGame = () => game.start(GameScene);
global.buildWalls = () => baseSystem.upgradeWalls();
global.buildWarehouses = () => baseSystem.upgradeWarehouses();
global.game = game;