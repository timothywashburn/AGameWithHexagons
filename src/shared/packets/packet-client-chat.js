const { Packet, PacketType, ClientPacket } = require('./packet');

module.exports = class PacketClientChat extends Packet {
    constructor(clientID, message) {
        super(ClientPacket.CHAT.code, PacketType.CLIENT_BOUND);

        this.clientID = clientID;
        this.message = message;
    }
};
