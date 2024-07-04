const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientGameInfo extends Packet {
	constructor(gameClients) {
		super(0x04, PacketType.CLIENT_BOUND);

		this.gameClients = gameClients.map((client) => {
			let { socket, ...clientWithoutSocket } = client;
			return clientWithoutSocket;
		});
	}
};
