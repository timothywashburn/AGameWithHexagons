const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientAnnouncement extends Packet {
	constructor(clientID, code) {
		super(ClientPacket.ANNOUNCEMENT.code, PacketType.CLIENT_BOUND);

		this.clientID = clientID;
		this.code = code;
	}
};
