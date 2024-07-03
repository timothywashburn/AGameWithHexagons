import './pages/play';
import './controllers/connection';
import './misc/ui'
import '../../shared/packets/packet';
import { prepareFrame } from './render';
import Tile from './objects/tile'

let game;

export function startGame() {
	game = new Game(5);
	game.startRender();
	console.log('Starting game render');
}

export function getGame() {
	return game;
}

class Game {
	constructor(boardSize) {
		this.boardSize = boardSize;

		this.startTime = Date.now();

		this.setupDebug();

		this.resources = {
			"energy": 0,
			"goo": 0,
		}

		this.tiles = []
		this.generateTiles();
	}

	generateTiles() {
		// for (let row = -this.boardSize + 1; row < this.boardSize; row++) {
		// 	for (let column = Math.abs(row) - (this.boardSize - 1) * 2; column <= -Math.abs(row) + (this.boardSize - 1) * 2; column += 2) {
		// 		this.tiles.push(new Tile(column, row));
		// 	}
		// }
		this.tiles.push(new Tile(0, 0));
		this.tiles.push(new Tile(-4, 0));
		this.tiles.push(new Tile(-6, 0));
		this.tiles.push(new Tile(-5, -1));
		this.tiles.push(new Tile(-5, 0));
	}

	setupDebug() {
		this.frame = 1;
		this.renderTimes = []

		setInterval(() => {
			let secondsElapsed = (Date.now() - this.startTime) / 1000;
			let frameRate = (this.frame / secondsElapsed).toFixed(1);
			this.renderTimes.splice(0, this.renderTimes.length - frameRate * 10);
			let MSPT = (this.renderTimes.reduce((a, b) => a + b) / this.renderTimes.length).toFixed(2);
			console.log(`${MSPT} ms per tick (${frameRate} fps)`);
		}, 5000);

		console.log("debugging enabled");
	}

	startRender() {
		this.tick()
	}

	async tick() {
		try {
			const renderStartTime = window.performance.now();

			prepareFrame();

			// Render tiles
			this.tiles.forEach(tile => tile.render());

			const finalRenderTime = window.performance.now() - renderStartTime;
			this.renderTimes.push(finalRenderTime);
			this.frame++;
		} catch (e) {
			console.error(e);
		}

		// await new Promise(resolve => setTimeout(resolve, 1000));
		requestAnimationFrame(() => this.tick());
	}
}