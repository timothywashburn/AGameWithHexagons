import { prepareFrame } from '../controllers/render';
import ClientTile from './client-tile';
import ClientTroop from './client-troop';
import {
	BuildingSnapshot,
	GameSnapshot,
	PlayerSnapshot,
	TileSnapshot,
	TroopSnapshot
} from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientBuilding from './client-building';
import { getClientBuildingConstructor, getClientTroopConstructor } from '../../client-register';
import { populateSpawnButtons, updateTurnText } from '../controllers/ui-overlay';
import { TurnType } from '../../../shared/enums/game/turn-type';
import Enum from '../../../shared/enums/enum';
import thePlayer from './client-the-player';
import { renderAction } from '../controllers/client-action-handler';

export class ClientGame {
	public startTime: number;
	public resources: any;

	public players: ClientPlayer[] = [];
	public tiles: ClientTile[] = [];
	public troops: ClientTroop[] = [];
	public buildings: ClientBuilding[] = [];

	public frame: number = 1;
	public renderTimes: number[] = [];

	public turnNumber: number;
	public turnType: TurnType;

	public selectedTile: ClientTile | null = null;

	constructor(initData: GameSnapshot) {
		console.log(initData);

		thePlayer.setGame(this);

		this.startTime = Date.now();
		this.setupDebug();
		this.initGame(initData);

		console.log('starting game render');
		this.startRender();

		populateSpawnButtons();
		updateTurnText();
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
		}, 10_000);

		console.log('debugging enabled');
	}

	initGame(gameSnapshot: GameSnapshot) {
		this.updateGame(gameSnapshot);
	}

	updateGame(snapshot: GameSnapshot) {
		if (!snapshot.isRunning) {
			let button = document.getElementById('start-game-button') as HTMLButtonElement;
			button.style.display = 'block';
		}

		this.updateTurnInfo(snapshot.turnNumber, snapshot.turnTypeIndex);

		this.resources = {
			energy: snapshot.resources.energy,
			goo: snapshot.resources.goo
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
				let TroopConstructor = getClientTroopConstructor(Enum.TroopType.getFromIndex(snapshot.typeIndex));
				thePlayer.getGame().troops.push(new TroopConstructor(snapshot));
			}
		});

		snapshot.buildings.forEach((snapshot: BuildingSnapshot) => {
			let building = this.buildings.find((building) => building.id === snapshot.id);
			if (building) {
				building.updateBuilding(snapshot);
			} else {
				let BuildingConstructor = getClientBuildingConstructor(
					Enum.BuildingType.getFromIndex(snapshot.typeIndex)
				);
				thePlayer.getGame().buildings.push(new BuildingConstructor(snapshot));
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

	updateTurnInfo(turnNumber: number, turnTypeIndex: number) {
		this.turnNumber = turnNumber;
		this.turnType = Enum.TurnType.getFromIndex(turnTypeIndex);
	}

	startRender() {
		const lobbyDiv = document.getElementById('gameLobby')!;
		const gameDiv = document.getElementById('game')!;

		lobbyDiv.style.display = 'none';
		gameDiv.style.display = 'block';

		this.renderFrame();
	}

	async renderFrame() {
		try {
			const renderStartTime = window.performance.now();

			prepareFrame();

			// Render tiles
			this.tiles.forEach((tile) => tile.renderTile());
			this.troops.forEach((troop) => troop.render());
			this.buildings.forEach((building) => building.render());

			thePlayer.getPlannedActions().forEach((action) => renderAction(action));

			const finalRenderTime = window.performance.now() - renderStartTime;
			this.renderTimes.push(finalRenderTime);
			this.frame++;
		} catch (e) {
			console.error(e);
		}

		// await new Promise(resolve => setTimeout(resolve, 1000));
		requestAnimationFrame(() => this.renderFrame());
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

	getTileByPosition(x: number, y: number): ClientTile | null {
		for (let tile of this.tiles) if (tile.x === x && tile.y == y) return tile;
		return null;
	}

	getTroop(id: number | undefined): ClientTroop | null {
		if (id == undefined) return null;
		for (let troop of this.troops) if (troop.id === id) return troop;
		console.error(`TROOP NOT FOUND: ${id}`);
		return null;
	}

	getTroopByTile(tileID: number): ClientTroop | null {
		if (tileID == undefined) return null;
		for (let tile of this.tiles) if (tile.id === tileID) return tile.troop;
		console.error(`TROOP NOT FOUND: ${tileID}`);
		return null;
	}

	getBuilding(id: number | undefined): ClientBuilding | null {
		if (id == undefined) return null;
		for (let building of this.buildings) if (building.id === id) return building;
		console.error(`BUILDING NOT FOUND: ${id}`);
		return null;
	}

	getBuildingByTile(tileID: number): ClientBuilding | null {
		if (tileID == undefined) return null;
		for (let tile of this.tiles) if (tile.id === tileID) return tile.building;
		console.error(`BUILDING NOT FOUND: ${tileID}`);
		return null;
	}
}
