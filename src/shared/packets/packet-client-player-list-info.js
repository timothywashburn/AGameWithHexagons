const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientPlayerListInfo extends Packet {
	constructor(playerListInfo) {
		super(ClientPacket.PLAYER_LIST_INFO.code, PacketType.CLIENT_BOUND);

		this.playerListInfo = playerListInfo;
	}
};
