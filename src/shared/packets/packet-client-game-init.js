const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientGameInit extends Packet {
	constructor(joinResponse) {
		super(0x01, PacketType.CLIENT_BOUND);
		this.joinResponse = joinResponse;
	}
};
