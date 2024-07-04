const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientGameInit extends Packet {
	constructor(initData) {
		super(ClientPacket.GAME_INIT.id, PacketType.CLIENT_BOUND);
		this.initData = initData;
	}
};
