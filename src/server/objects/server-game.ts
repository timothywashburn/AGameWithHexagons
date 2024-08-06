import {Server} from "http";
import ServerClient from "./server-client";
import ServerTile from "./server-tile";
import ServerTroop from "./server-troop";
import {GameSnapshot} from '../../shared/interfaces/snapshot';
import ConnectionManager from '../controllers/connection-manager';
import {AnnouncementType} from '../../shared/enums/misc-enums';
import ServerBuilding from './server-building';
import PacketClientGameInit from '../../shared/packets/client/packet-client-game-init';
import PacketClientGameSnapshot from '../../shared/packets/client/packet-client-game-snapshot';
import {cli} from 'webpack';
import ServerPlayer from './server-player';

let nextID = 1;

export default class ServerGame {
    public static gameList: ServerGame[] = [];

    public id: number;
    public clientManager: ConnectionManager;
    public readonly startTime: number = Date.now();

    public players: ServerPlayer[] = [];
    public tiles: ServerTile[] = [];
    public troops: ServerTroop[] = [];
    public buildings: ServerBuilding[] = [];

    public readonly boardSize: number;

    constructor(httpServer: Server, boardSize: number) {
        this.id = nextID++;

        this.clientManager = new ConnectionManager(this);

        this.boardSize = boardSize;

        this.generateTiles();

        ServerGame.gameList.push(this);
    }

    getName() {
        return `Game ${ServerGame.gameList.indexOf(this) + 1}`;
    }

    isJoinable() {
        return this.clientManager.clients.length < this.clientManager.maxPlayers;
    }

    generateTiles() {
        for (let row = -this.boardSize + 1; row < this.boardSize; row++) {
        	for (let column = Math.abs(row) - (this.boardSize - 1) * 2; column <= -Math.abs(row) + (this.boardSize - 1) * 2; column += 2) {
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
            isAuthenticated: client.isAuthenticated,
            players: this.players.map(player => player.getPlayerSnapshot(client)),
            tiles: this.tiles.map(tile => tile.getTileSnapshot(client)),
            troops: this.troops.map(troop => troop.getTroopSnapshot(client)),
            buildings: this.buildings.map(building => building.getBuildingSnapshot(client))
        }
    }

    sendServerSnapshot() {
        this.clientManager.clients.forEach(client => this.sendSnapshot(client));
    }

    sendSnapshot(client: ServerClient) {
        let packet = new PacketClientGameSnapshot(this.getFullGameSnapshot(client));
        packet.addClient(client);
        packet.sendToClients();
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