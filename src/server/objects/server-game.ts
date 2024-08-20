import { Server } from 'http';
import ServerClient from './server-client';
import ServerTile from './server-tile';
import ServerTroop from './server-troop';
import { GameSnapshot, TurnInfo } from '../../shared/interfaces/snapshot';
import ConnectionManager from '../controllers/connection-manager';
import ServerBuilding from './server-building';
import PacketClientGameSnapshot from '../../shared/packets/client/packet-client-game-snapshot';
import ServerPlayer from './server-player';
import PacketClientTurnStart from '../../shared/packets/client/packet-client-turn-start';
import { TurnType } from '../../shared/enums/gamestate-enums';
import PacketClientPlayerListInfo from '../../shared/packets/client/packet-client-player-list-info';
import PacketClientDev from '../../shared/packets/client/packet-client-dev';

let nextID = 0;

export default class ServerGame {
	public static gameList: ServerGame[] = [];

	public id: number;
	public connectionManager: ConnectionManager;
	public isRunning: boolean = false;
	public startTime: number;

	public players: ServerPlayer[] = [];
	public tiles: ServerTile[] = [];
	public troops: ServerTroop[] = [];
	public buildings: ServerBuilding[] = [];

	public turnInfo: TurnInfo = {
		turn: 1,
		type: TurnType.DEVELOP,
	};

	constructor(httpServer: Server) {
		this.id = nextID++;

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

	getFullGameSnapshot(client: ServerClient): GameSnapshot {
		return {
			isRunning: this.isRunning,
			isAuthenticated: client.isAuthenticated,
			turnInfo: this.turnInfo,
			resources: client.resources,
			players: this.players.map((player) => player.getPlayerSnapshot(client)),
			tiles: this.tiles.map((tile) => tile.getTileSnapshot(client)),
			troops: this.troops.map((troop) => troop.getTroopSnapshot(client)),
			buildings: this.buildings.map((building) => building.getBuildingSnapshot(client)),
		};
	}

	sendServerSnapshot() {
		this.connectionManager.clients.forEach((client) => this.sendSnapshot(client));
	}

	sendSnapshot(client: ServerClient) {
		let packet = new PacketClientGameSnapshot(this.getFullGameSnapshot(client));
		packet.addClient(client);
		packet.sendToClients();
	}

	attemptEndTurn() {
		if (this.connectionManager.waitingToEndTurn.length !== 0) return;
		console.log('ending turn');
		this.endTurn();
	}

	private endTurn() {
		this.connectionManager.waitingToEndTurn = this.connectionManager.clients;
		this.sendServerSnapshot();

		this.turnInfo.turn++;
		this.turnInfo.type = this.turnInfo.turn % 2 == 0 ? TurnType.SIEGE : TurnType.DEVELOP;

		setTimeout(() => {
			let packet = new PacketClientTurnStart(this.turnInfo);
			this.connectionManager.clients.forEach((client) => packet.addClient(client));
			packet.sendToClients();
		}, 1000);
	}

	getName() {
		return `Game ${ServerGame.gameList.indexOf(this) + 1}`;
	}

	isJoinable() {
		return this.connectionManager.clients.length < this.connectionManager.maxPlayers && !this.isRunning;
	}

	getPlayer(id: number): ServerPlayer | null {
		for (let player of this.players) if (player.id === id) return player;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}

	getTile(id: number): ServerTile | null {
		for (let game of this.tiles) if (game.id === id) return game;
		console.error(`TILE NOT FOUND: ${id}`);
		return null;
	}

	static getGame(id: number): ServerGame | null {
		for (let game of ServerGame.gameList) if (game.id === id) return game;
		console.error(`GAME NOT FOUND: ${id}`);
		return null;
	}
}
