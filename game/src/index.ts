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
game.registerSystem(MovingSystem);
game.registerSystem(EnemySystem);
game.registerSystem(HUDSystem);
game.registerSystem(BaseSystem);

(window as any).startGame = () => game.start(GameScene);

(window as any)['game'] = game;