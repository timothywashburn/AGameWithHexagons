const { Packet, PacketType } = require('./packet.js');

module.exports = class PacketClientNameConfirm extends Packet {
	constructor(name, code = 0x00) {
		super(0x03, PacketType.CLIENT_BOUND);
		this.name = name;
		this.code = code;
	}
};
