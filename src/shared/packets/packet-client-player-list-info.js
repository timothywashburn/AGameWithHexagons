const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientPlayerListInfo extends Packet {
	constructor(playerListInfo) {
		super(0x04, PacketType.CLIENT_BOUND);

		this.playerListInfo = playerListInfo;
	}
};
