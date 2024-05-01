const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientAnnouncement extends Packet {
	constructor(clientID, code) {
		super(0x07, PacketType.CLIENT_BOUND);
		this.clientID = clientID;
		this.code = code;
	}
};
