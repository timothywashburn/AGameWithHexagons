const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientGameInit extends Packet {
	constructor(isDev) {
		super(0x01, PacketType.CLIENT_BOUND);
		this.isDev = isDev;
	}
};
