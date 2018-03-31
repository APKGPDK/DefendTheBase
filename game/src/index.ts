import './style.css'
import Game from './Engine/Game';
import GameScene from './Scenes/GameScene';

const canvas = <HTMLCanvasElement>document.getElementById('game')

const game = new Game(canvas)
game.start(GameScene)