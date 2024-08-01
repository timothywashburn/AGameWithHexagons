import { prepareFrame } from '../controllers/render';
import ClientTile from './client-tile'
import ClientTroop from './client-troop';
import {BuildingSnapshot, PlayerSnapshot, TileSnapshot, TroopSnapshot} from '../../../shared/interfaces/snapshot';
import GameSnapshot from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientBuilding from './client-building';

let game: ClientGame;

export const getGame = () => game;

export class ClientGame {
	public startTime: number;
	public resources: any;

	public players: ClientPlayer[];
	public tiles: ClientTile[];
	public troops: ClientTroop[];
	public buildings: ClientBuilding[];

	public frame: number = 1;
	public renderTimes: number[] = [];

	constructor(initData: GameSnapshot) {
		game = this;
		this.startTime = Date.now();

		this.setupDebug();

		this.players = [];
		this.tiles = [];
		this.troops = [];
		this.buildings = [];

		this.updateGame(initData);

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

	updateGame(snapshot: GameSnapshot) {
		// console.log("initData");
		// console.log(initData);

		this.resources = {
			"energy": 0,
			"goo": 0,
		}

		this.players = snapshot.players.map((playerInitData: PlayerSnapshot) => new ClientPlayer(playerInitData));
		this.tiles = snapshot.tiles.map((tileInitData: TileSnapshot) => new ClientTile(tileInitData));
		this.troops = snapshot.troops.map((troopInitData: TroopSnapshot) => new ClientTroop(troopInitData));
		this.buildings = snapshot.buildings.map((buildingInitData: BuildingSnapshot) => new ClientBuilding(buildingInitData));
	}

	startRender() {
		const lobbyDiv = document.getElementById('gameLobby')!;
		const gameDiv = document.getElementById('game')!;

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
