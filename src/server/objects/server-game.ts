import {Server} from "http";
import ServerClient from "./server-client";
import ServerTile from "./server-tile";
import ServerTroop from "./server-troop";
import GameInitData from '../../shared/interfaces/init-data';
import GameClientManager from '../controllers/game-client-manager';
import {AnnouncementType} from '../../shared/enums';

let nextID = 0;

export default class ServerGame {
    public static gameList: ServerGame[] = [];

    public id: number;

    public clientManager: GameClientManager;

    public readonly startTime: number = Date.now();

    public tiles: ServerTile[] = [];
    public troops: ServerTroop[] = [];

    public readonly boardSize: number;

    constructor(httpServer: Server, boardSize: number) {
        this.id = nextID++;

        this.clientManager = new GameClientManager(this);

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

    getClientInitData(client: ServerClient): GameInitData {
        return {
            isAuthenticated: client.isAuthenticated,
            tiles: this.tiles.map(tile => tile.getClientTileData(client)),
            troops: this.troops.map(troop => troop.getClientTroopData(client))
        }
    }

    getSnapshotData(client: ServerClient) {
        // return {
        //     tiles: this.tiles
        // }
    }

    sendSnapshot(client: ServerClient) {
        // let packet = new PacketClientGameSnapshot(this.getClientInitData(client));
        // packet.addClient(client);
        // packet.send();
    }

    tileIsValid(tile: ServerTile) {
        return (tile.x + tile.y) % 2 === 0;
    }

    addPlayer() {
    }

    removePlayer(client: ServerClient) {
        this.clientManager.clients = this.clientManager.clients.filter((testClient: ServerClient) => testClient !== client);

        this.clientManager.sendAlert(client, AnnouncementType.GAME_LEAVE);
        this.clientManager.updatePlayerList();
    }

    static getGame(id: number): ServerGame {
        for (let game of ServerGame.gameList) if (game.id === id) return game;
        throw new Error("Game not found");
    }
}