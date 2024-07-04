const { Packet, PacketType, ServerPacket } = require('./packet');

module.exports = class PacketServerChat extends Packet {
    constructor(message) {
        super(ServerPacket.CHAT.code, PacketType.SERVER_BOUND);

        this.message = message;
    }
};
