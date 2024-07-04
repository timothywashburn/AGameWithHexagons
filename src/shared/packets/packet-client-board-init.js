const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientBoardInit extends Packet {
	constructor(tileMap) {
		super(0x08, PacketType.CLIENT_BOUND);

		this.tileMap = tileMap;
	}
};
