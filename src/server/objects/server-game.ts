const GameClientManager = require('../controllers/game-client-manager');
const { ServerTile } = require('./server-tile');
const { ServerTroop } = require('./server-troop');
const PacketClientGameSnapshot = require('../../shared/packets/packet-client-game-snapshot');
const { games } = require('../controllers/game-manager');
const {AnnouncementType} = require('../../shared/enums');
let { globalClients } = require('./client');

class ServerGame {
    private clientManager: typeof GameClientManager;

    private readonly startTime: number = Date.now();

    private tiles: typeof ServerTile[] = [];
    private troops: typeof ServerTroop[] = [];

    private readonly boardSize: number;

    constructor(server, boardSize) {
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

    getClientInitData(client) {
        return {
            tiles: this.tiles.map(tile => tile.getClientTileData(client)),
            troops: this.troops.map(troop => troop.getClientTroopData(client))
        }
    }

    getSnapshotData(client) {
        // return {
        //     tiles: this.tiles
        // }
    }

    sendSnapshot(client) {
        // let packet = new PacketClientGameSnapshot(this.getClientInitData(client));
        // packet.addClient(client);
        // packet.send();
    }

    tileIsValid(tile) {
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

module.exports = {
    Game: ServerGame
};