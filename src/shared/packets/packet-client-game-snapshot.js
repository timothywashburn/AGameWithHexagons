const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientGameSnapshot extends Packet {
	constructor(snapshot) {
		super(0x02, PacketType.CLIENT_BOUND);

		this.snapshot = snapshot;
	}
};
