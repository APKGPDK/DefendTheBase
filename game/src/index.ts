import './style.css'
import Game from './Engine/Game';
import GameScene from './Scenes/GameScene';
import MovingSystem from './Systems/MovingSystem';
import EnemySystem from './Systems/EnemySystem';
import './polyfills.ts';

const canvas = <HTMLCanvasElement>document.getElementById('game')

const game = new Game(canvas)
game.registerSystem(MovingSystem)
game.registerSystem(EnemySystem)
game.start(GameScene)