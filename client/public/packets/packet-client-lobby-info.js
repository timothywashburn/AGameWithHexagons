const { Packet, PacketType } = require('../packet.js');

class PacketClientLobbyInfo extends Packet {
    constructor(lobbyClients) {
        super(0x04, PacketType.CLIENT_BOUND);

        this.lobbyClients = lobbyClients.map(client => {
            let { socket, ...clientWithoutSocket } = client;
            return clientWithoutSocket;
        });
    }
}

module.exports = { PacketClientLobbyInfo };
