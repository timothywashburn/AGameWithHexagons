const { Packet, PacketType } = require('./packet');

module.exports = class PacketServerNameSelect extends Packet {
	constructor(name) {
		super(0x02, PacketType.SERVER_BOUND);
		this.name = name;
	}
};