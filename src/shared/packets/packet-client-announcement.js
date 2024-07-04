const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientAnnouncement extends Packet {
	constructor(clientID, id) {
		super(ClientPacket.ANNOUNCEMENT.id, PacketType.CLIENT_BOUND);

		this.clientID = clientID;
		this.id = id;
	}
};
