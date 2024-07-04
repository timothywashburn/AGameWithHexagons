const GameClientManager = require('../game-client-manager');
const { Tile } = require('./tile');
const PacketClientGameSnapshot = require('../../shared/packets/packet-client-game-snapshot');
const { games } = require('../game-manager');
const {AnnouncementType} = require('../../shared/enums');
let { globalClients } = require('../client');

class ServerGame {
    constructor(server, boardSize) {
        this.clientManager = new GameClientManager(this);

        this.boardSize = boardSize;

        this.startTime = Date.now();

        this.resources = {
            "energy": 0,
            "goo": 0,
        }

        this.tiles = []
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
        for (let row = -this.boardSize + 1; row < this.boardSize; row++) {
        	for (let column = Math.abs(row) - (this.boardSize - 1) * 2; column <= -Math.abs(row) + (this.boardSize - 1) * 2; column += 2) {
                let tile = new Tile(column, row);
                if (!this.tileIsValid(tile)) {
                    continue;
                }
        		this.tiles.push(tile);
        	}
        }

        // this.tiles.push(new Tile(0, 0));
        // this.tiles.push(new Tile(-4, 0));
        // this.tiles.push(new Tile(-6, 0));
        // this.tiles.push(new Tile(-5, -1));
        // this.tiles.push(new Tile(-5, 0)); //This tile should Error
    }

    sendSnapshot(client) {
        let snapshot = {
            tiles: this.tiles
        }

        let packet = new PacketClientGameSnapshot(snapshot);
        packet.addClient(client);
        packet.send();
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
