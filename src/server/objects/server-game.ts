import {Http2Server} from "http2";
import {Server} from "http";
import Client from "./client";
import ServerTile from "./server-tile";
import ServerTroop from "./server-troop";

const GameClientManager = require('../controllers/game-client-manager');
const PacketClientGameSnapshot = require('../../shared/packets/packet-client-game-snapshot');
const { games } = require('../controllers/game-manager');
const {AnnouncementType} = require('../../shared/enums');

export default class ServerGame {
    public static gameList: ServerGame[] = [];

    public clientManager: typeof GameClientManager;

    public readonly startTime: number = Date.now();

    public tiles: ServerTile[] = [];
    public troops: ServerTroop[] = [];

    public readonly boardSize: number;

    constructor(httpServer: Server, boardSize: number) {
        ServerGame.gameList.push(this);

        this.clientManager = new GameClientManager(this);

        this.boardSize = boardSize;

        this.generateTiles();

        games.push(this);
    }

    getName() {
        return `Game ${games.indexOf(this) + 1}`;
    }

    isJoinable() {
        return this.clientManager.clients.length < this.clientManager.maxPlayers;
    }

    generateTiles() {
        // for (let row = -this.boardSize + 1; row < this.boardSize; row++) {
        // 	for (let column = Math.abs(row) - (this.boardSize - 1) * 2; column <= -Math.abs(row) + (this.boardSize - 1) * 2; column += 2) {
        //         let tile = new ServerTile(column, row);
        //         if (!this.tileIsValid(tile)) {
        //             continue;
        //         }
        // 		this.tiles.push(tile);
        // 	}
        // }

        let testTile = new ServerTile(0, 0);
        this.troops.push(new ServerTroop(11, testTile));
        this.tiles.push(testTile);

        this.tiles.push(new ServerTile(-4, 0));
        this.tiles.push(new ServerTile(-6, 0));
        this.tiles.push(new ServerTile(-5, -1));
        // this.tiles.push(new ServerTile(-5, 0)); //This tile should Error
    }

    getClientInitData(client: Client) {
        return {
            tiles: this.tiles.map(tile => tile.getClientTileData(client)),
            troops: this.troops.map(troop => troop.getClientTroopData(client))
        }
    }

    getSnapshotData(client: Client) {
        // return {
        //     tiles: this.tiles
        // }
    }

    sendSnapshot(client: Client) {
        // let packet = new PacketClientGameSnapshot(this.getClientInitData(client));
        // packet.addClient(client);
        // packet.send();
    }

    tileIsValid(tile: ServerTile) {
        return (tile.x + tile.y) % 2 === 0;
    }

    addPlayer() {
    }

    removePlayer(client) {
        this.clientManager.clients = this.clientManager.clients.filter(testClient => testClient !== client);

        this.clientManager.sendAlert(client, AnnouncementType.GAME_LEAVE);
        this.clientManager.updatePlayerList();
    }
}