import './style.css'
import Game from './Engine/Game';
import GameScene from './Scenes/GameScene';
import MovingSystem from './Systems/MovingSystem';

const canvas = <HTMLCanvasElement>document.getElementById('game')

const game = new Game(canvas)
game.registerSystem(MovingSystem)
game.start(GameScene)