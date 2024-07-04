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

export default class Game {
	constructor() {
		this.startTime = Date.now();

		this.setupDebug();

		this.resources = {
			"energy": 0,
			"goo": 0,
		}

		this.tiles = []
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

	loadBoard(tileMap) {
		this.tiles = tileMap.map(tile => new Tile(tile.x, tile.y));
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
