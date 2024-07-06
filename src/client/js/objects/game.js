import { prepareFrame } from '../render';
import Tile from './tile'

let game;

export const getGame = () => game;

export class Game {
	constructor() {
		game = this;
		this.startTime = Date.now();

		this.setupDebug();

		this.resources = {
			"energy": 0,
			"goo": 0,
		}

		this.tiles = []

		console.log('starting game render');
		this.startRender();
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

	loadBoard(tiles) {
		this.tiles = tiles.map(tile => new Tile(tile.x, tile.y));
	}

	startRender() {
		const lobbyDiv = document.getElementById('gameLobby');
		const gameDiv = document.getElementById('game');

		lobbyDiv.style.display = 'none';
		gameDiv.style.display = 'block';

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
