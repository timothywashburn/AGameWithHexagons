const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientGameSnapshot extends Packet {
	constructor(snapshot) {
		super(ClientPacket.GAME_SNAPSHOT.code, PacketType.CLIENT_BOUND);

		this.snapshot = snapshot;
	}
};
