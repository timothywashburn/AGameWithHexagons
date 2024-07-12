import { prepareFrame } from '../render';
import Tile from './tile'
import Troop from './troop';

let game;

export const getGame = () => game;

export class Game {
	constructor(initData) {
		game = this;
		this.startTime = Date.now();

		this.setupDebug();

		this.tiles = [];
		this.troops = [];
		this.buildings = [];

		this.loadGame(initData);

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
			let maxLoad = 1000 / frameRate;
			let currentLoad = MSPT / maxLoad * 100;
			console.log(`${MSPT} ms (${currentLoad.toFixed(1)}% load) per tick (${frameRate} fps)`);
		}, 5000);

		console.log("debugging enabled");
	}

	loadGame(initData) {
		// console.log("initData");
		// console.log(initData);

		this.resources = {
			"energy": 0,
			"goo": 0,
		}

		this.tiles = initData.tiles.map(tileData => new Tile(tileData));
		this.troops = initData.troops.map(troopData => new Troop(troopData));
	}

	updateGame(snapshot) {
		// console.log("snapshot");
		// console.log(snapshot);

		this.tiles.forEach(tile => tile.updateTile(snapshot.tiles.find(testTile => testTile.x === tile.x && testTile.y === tile.y)));
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
			this.tiles.forEach(tile => tile.renderTile());
			this.troops.forEach(troop => troop.renderTroop());

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
