import { prepareFrame } from '../controllers/render';
import ClientTile from './client-tile';
import ClientTroop from './client-troop';
import {
	BuildingSnapshot,
	ElementSnapshot,
	PlayerSnapshot,
	TileSnapshot,
	TroopSnapshot,
} from '../../../shared/interfaces/snapshot';
import { GameSnapshot } from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientBuilding from './client-building';
import { init } from '../../../server/controllers/authentication';
import ClientElement from './client-element';
import { keyword } from 'chalk';
import { getTroopType } from '../../../shared/enums/unit-enums';
import ClientMeleeTroop from './units/troops/client-melee-troop';
import { getClientBuildingConstructor, getClientTroopConstructor } from '../../client-register';

let game: ClientGame;

export const getGame = () => game;

export class ClientGame {
	public startTime: number;
	public resources: any;

	public players: ClientPlayer[] = [];
	public tiles: ClientTile[] = [];
	public troops: ClientTroop[] = [];
	public buildings: ClientBuilding[] = [];

	public frame: number = 1;
	public renderTimes: number[] = [];

	public selectedTile: ClientTile | null = null;

	constructor(initData: GameSnapshot) {
		game = this;
		this.startTime = Date.now();

		this.setupDebug();

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
			let currentLoad = (MSPT / maxLoad) * 100;
			console.log(`${MSPT} ms (${currentLoad.toFixed(1)}% load) per tick (${frameRate} fps)`);
		}, 5000);

		console.log('debugging enabled');
	}

	initGame(gameSnapshot: GameSnapshot) {
		this.updateGame(gameSnapshot);
	}

	updateGame(snapshot: GameSnapshot) {
		this.resources = {
			energy: 0,
			goo: 0,
		};

		snapshot.players.forEach((snapshot: PlayerSnapshot) => {
			let player = this.players.find((player) => player.id === snapshot.id);
			if (player) {
				player.updatePlayer(snapshot);
			} else {
				new ClientPlayer(snapshot);
			}
		});

		snapshot.troops.forEach((snapshot: TroopSnapshot) => {
			let troop = this.troops.find((troop) => troop.id === snapshot.id);
			if (troop) {
				troop.updateTroop(snapshot);
			} else {
				let TroopConstructor = getClientTroopConstructor(snapshot.type);
				new TroopConstructor(snapshot);
			}
		});

		snapshot.buildings.forEach((snapshot: BuildingSnapshot) => {
			let building = this.buildings.find((building) => building.id === snapshot.id);
			if (building) {
				building.updateBuilding(snapshot);
			} else {
				let BuildingConstructor = getClientBuildingConstructor(snapshot.type);
				new BuildingConstructor(snapshot);
			}
		});

		snapshot.tiles.forEach((snapshot: TileSnapshot) => {
			let tile = this.tiles.find((tile) => tile.id === snapshot.id);
			if (tile) {
				tile.updateTile(snapshot);
			} else {
				new ClientTile(snapshot);
			}
		});
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
			this.tiles.forEach((tile) => tile.renderTile());
			this.troops.forEach((troop) => troop.renderTroop());
			this.buildings.forEach((building) => building.renderBuilding());

			const finalRenderTime = window.performance.now() - renderStartTime;
			this.renderTimes.push(finalRenderTime);
			this.frame++;
		} catch (e) {
			console.error(e);
		}

		// await new Promise(resolve => setTimeout(resolve, 1000));
		requestAnimationFrame(() => this.tick());
	}

	getPlayer(id: number | undefined): ClientPlayer | null {
		if (id == undefined) return null;
		for (let player of this.players) if (player.id === id) return player;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}

	getTile(id: number | undefined): ClientTile | null {
		if (id == undefined) return null;
		for (let tile of this.tiles) if (tile.id === id) return tile;
		console.error(`TILE NOT FOUND: ${id}`);
		return null;
	}

	getTroop(id: number | undefined): ClientTroop | null {
		if (id == undefined) return null;
		for (let troop of this.troops) if (troop.id === id) return troop;
		console.error(`TROOP NOT FOUND: ${id}`);
		return null;
	}

	getBuilding(id: number | undefined): ClientBuilding | null {
		if (id == undefined) return null;
		for (let building of this.buildings) if (building.id === id) return building;
		console.error(`BUILDING NOT FOUND: ${id}`);
		return null;
	}
}
