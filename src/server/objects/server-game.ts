import { Server } from 'http';
import ServerClient from './server-client';
import ServerTile from './server-tile';
import ServerTroop from './server-troop';
import { GameInitData, GameSnapshot } from '../../shared/interfaces/snapshot';
import ConnectionManager from '../controllers/connection-manager';
import ServerBuilding from './server-building';
import ServerPlayer from './server-player';
import PacketClientTurnStart from '../../shared/packets/client/packet-client-turn-start';
import PacketClientPlayerListInfo from '../../shared/packets/client/packet-client-player-list-info';
import PacketClientDev from '../../shared/packets/client/packet-client-dev';
import Enum from '../../shared/enums/enum';
import { TurnType, TurnTypeEnum } from '../../shared/enums/game/turn-type';
import { cli } from 'webpack';
import { handleAction } from '../controllers/server-action-handler';
import { clientSocket } from '../../client/js/controllers/connection';
import ClientTile from "../../client/js/objects/client-tile";

let gameID = 0;

export default class ServerGame {
	public static gameList: ServerGame[] = [];

	public id: number;
	private nextElementID: number = 0;
	public nextPlayerTeamColor: number = 0;
	public connectionManager: ConnectionManager;
	public isRunning: boolean = false;
	public startTime: number;

	public players: ServerPlayer[] = [];
	public tiles: ServerTile[] = [];
	public troops: ServerTroop[] = [];
	public buildings: ServerBuilding[] = [];

	public turnNumber: number = 1;
	public turnType: TurnType = Enum.TurnType.DEVELOP;

	constructor() {
		this.id = gameID++;

		this.connectionManager = new ConnectionManager(this);

		this.generateTiles();

		ServerGame.gameList.push(this);
	}

	start() {
		if (this.isRunning) {
			console.error('The game is already running');
			return;
		}

		this.isRunning = true;
		this.startTime = Date.now();

		this.connectionManager.waitingToEndTurn = this.connectionManager.clients;

		let packet = new PacketClientDev({ action: 'HIDE_START_GAME_BUTTON' });
		this.connectionManager.clients.forEach((client) => packet.addClient(client));
		packet.sendToClients();
	}

	generateTiles() {
		let boardSize = 5;
		for (let row = -boardSize + 1; row < boardSize; row++) {
			for (
				let column = Math.abs(row) - (boardSize - 1) * 2;
				column <= -Math.abs(row) + (boardSize - 1) * 2;
				column += 2
			) {
				new ServerTile(this, column, row);
			}
		}

		// let testTile = new ServerTile(0, 0);
		// this.troops.push(new ServerTroop(11, testTile));
		// this.tiles.push(testTile);
		//
		// this.tiles.push(new ServerTile(-4, 0));
		// this.tiles.push(new ServerTile(-6, 0));
		// this.tiles.push(new ServerTile(-5, -1));
		// this.tiles.push(new ServerTile(-5, 0)); //This tile should Error
	}

	getGameInitData(client: ServerClient): GameInitData {
		let player = client.getPlayer();
		if (player == null) throw new Error('Player for client: ' + client.getID() + ' not found in game: ' + this.id);

		return {
			plannedActions: player.plannedActions,
			...this.getGameSnapshot(client)
		};
	}

	getGameSnapshot(client: ServerClient): GameSnapshot {
		let player = client.getPlayer();
		if (player == null) throw new Error('Player for client: ' + client.getID() + ' not found in game: ' + this.id);

		return {
			isRunning: this.isRunning,
			isAuthenticated: client.isAuthenticated,
			turnNumber: this.turnNumber,
			turnTypeIndex: this.turnType.getIndex(),
			resources: player!.resources,
			players: this.players.map((player) => player.getPlayerSnapshot()),
			tiles: this.tiles.map((tile) => tile.getTileSnapshot()),
			troops: this.troops.map((troop) => troop.getTroopSnapshot()),
			buildings: this.buildings.map((building) => building.getBuildingSnapshot())
		};
	}

	attemptEndTurn() {
		if (this.connectionManager.waitingToEndTurn.length !== 0) return;
		console.log('ending turn');
		this.endTurn();
	}

	private endTurn() {
		let clientsToProcess = [...this.connectionManager.clients];

		while (clientsToProcess.length > 0) {
			const client: ServerClient = clientsToProcess.shift()!;
			let player = client.getPlayer();

			if (player == null) throw new Error('Player for client: ' + client.getID() + ' not found in game: ' + this.id);

			if (player.plannedActions.length > 0) {
				const actionToExecute = player.plannedActions.shift()!;
				if (player.plannedActions.length > 0) clientsToProcess.push(client);
				handleAction(client, actionToExecute);
			}
		}

		this.connectionManager.waitingToEndTurn = this.connectionManager.clients;

		this.turnNumber++;
		this.turnType = this.turnNumber % 2 == 0 ? Enum.TurnType.SIEGE : Enum.TurnType.DEVELOP;

		this.troops.forEach(troop => troop.hasMoved = false);

		setTimeout(() => {
			this.connectionManager.clients.forEach((client) => {
				new PacketClientTurnStart(this.getGameSnapshot(client), this.turnNumber, this.turnType.getIndex())
					.addClient(client)
					.sendToClients();
			});
		}, 1000);
	}

	getName() {
		return `Game ${ServerGame.gameList.indexOf(this) + 1}`;
	}

	getTroop(id: number): ServerTroop | null {
		for (let troop of this.troops) {
			if (troop.id === id) return troop
		}

		return null;
	}


	isJoinable() {
		return this.connectionManager.clients.length < this.connectionManager.maxPlayers && !this.isRunning;
	}

	getNextID() {
		return this.nextElementID++;
	}

	getPlayer(id: number): ServerPlayer | null {
		for (let player of this.players) if (player.id === id) return player;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}

	getTile(id: number): ServerTile | null {
		for (let tile of this.tiles) if (tile.id === id) return tile;
		console.error(`TILE NOT FOUND: ${id}`);
		return null;
	}

	getTileByPosition(x: number, y: number): ServerTile | null {
		for (let tile of this.tiles) if (tile.x === x && tile.y == y) return tile;
		return null;
	}

	static getGame(id: number): ServerGame | null {
		for (let game of ServerGame.gameList) if (game.id === id) return game;
		console.error(`GAME NOT FOUND: ${id}`);
		return null;
	}
}
