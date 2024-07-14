import { prepareFrame } from '../render';
import Tile from './tile'
import Troop from './troop';

let game: Game;

export const getGame = () => game;

export class Game {

	public startTime: number;
	public resources: any;
	public tiles: Tile[];
	public troops: Troop[];
	public buildings: any[];

	public frame: number = 1;
	public renderTimes: number[] = [];

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
		setInterval(() => {
			let secondsElapsed = (Date.now() - this.startTime) / 1000;
			let frameRate = +(this.frame / secondsElapsed).toFixed(1);
			this.renderTimes.splice(0, this.renderTimes.length - frameRate * 10);
			let MSPT = +(this.renderTimes.reduce((a, b) => a + b) / this.renderTimes.length).toFixed(2);
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

		this.tiles.forEach(tile => tile.updateTile(snapshot.tiles.find((testTile: Tile) => testTile.id === tile.id)));
	}

	startRender() {
		const lobbyDiv = document.getElementById('gameLobby') as HTMLElement;
		const gameDiv = document.getElementById('game') as HTMLElement;

		lobbyDiv.style.display = 'none';
		gameDiv.style.display = 'block';

		this.tick();
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
