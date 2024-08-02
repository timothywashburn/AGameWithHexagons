import { prepareFrame } from '../controllers/render';
import ClientTile from './client-tile'
import ClientTroop from './client-troop';
import {
	BuildingSnapshot,
	ElementSnapshot,
	PlayerSnapshot,
	TileSnapshot,
	TroopSnapshot
} from '../../../shared/interfaces/snapshot';
import {GameSnapshot} from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientBuilding from './client-building';
import {init} from '../../../server/authentication';
import ClientElement from './client-element';

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

	public selectedTile: ClientTile | null = null;

	constructor(initData: GameSnapshot) {
		game = this;
		this.startTime = Date.now();

		this.setupDebug();

		this.players = [];
		this.tiles = [];
		this.troops = [];
		this.buildings = [];

		this.initGame(initData);

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

	initGame(gameSnapshot: GameSnapshot) {
		this.updateGame(gameSnapshot);
	}

	updateGame(snapshot: GameSnapshot) {
		this.resources = {
			"energy": 0,
			"goo": 0,
		}

		const updateElement = <T extends ClientElement, S extends ElementSnapshot>(
			constructor: new (snapshot: S) => T,
			gameElements: T[],
			elementSnapshotList: S[],
			updateMethod: (element: T, snapshot: S) => void
		) => {
			elementSnapshotList.forEach((snapshot: S) => {
				let element = gameElements.find(element => element['id'] === snapshot['id']);
				if (element) {
					updateMethod(element, snapshot);
				} else {
					gameElements.push(new constructor(snapshot));
				}
			});
		};

		updateElement<ClientPlayer, PlayerSnapshot>(ClientPlayer, this.players, snapshot.players,
			(player, snapshot) => player.updatePlayer(snapshot));
		updateElement<ClientTile, TileSnapshot>(ClientTile, this.tiles, snapshot.tiles,
			(tile, snapshot) => tile.updateTile(snapshot));
		updateElement<ClientTroop, TroopSnapshot>(ClientTroop, this.troops, snapshot.troops,
			(troop, snapshot) => troop.updateTroop(snapshot));
		updateElement<ClientBuilding, BuildingSnapshot>(ClientBuilding, this.buildings, snapshot.buildings,
			(building, snapshot) => building.updateBuilding(snapshot));
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

	getPlayer(id: number): ClientPlayer | null {
		for (let player of this.players) if (player.id === id) return player;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}

	getTile(id: number): ClientTile | null {
		for (let tile of this.tiles) if (tile.id === id) return tile;
		console.error(`TILE NOT FOUND: ${id}`);
		return null;
	}

	getTroop(id: number): ClientTroop | null {
		for (let troop of this.troops) if (troop.id === id) return troop;
		console.error(`TROOP NOT FOUND: ${id}`);
		return null;
	}

	getBuilding(id: number): ClientBuilding | null {
		for (let building of this.buildings) if (building.id === id) return building;
		console.error(`BUILDING NOT FOUND: ${id}`);
		return null;
	}
}
