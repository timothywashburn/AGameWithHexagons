const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientGameInit extends Packet {
	constructor(joinResponse) {
		super(ClientPacket.GAME_INIT.id, PacketType.CLIENT_BOUND);

		this.joinResponse = joinResponse;
	}
};
