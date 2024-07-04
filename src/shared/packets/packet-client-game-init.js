const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientGameInit extends Packet {
	constructor() {
		super(0x01, PacketType.CLIENT_BOUND);
		this.isDev = false;
	}
};
