const { Packet, PacketType } = require('./packet.js');

module.exports = class PacketClientGameInit extends Packet {
	constructor() {
		super(0x01, PacketType.CLIENT_BOUND);
	}
};
