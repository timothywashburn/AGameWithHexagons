const { Packet, PacketType, ServerPacket } = require('./packet');

module.exports = class PacketServerChat extends Packet {
    constructor(message) {
        super(ServerPacket.CHAT.id, PacketType.SERVER_BOUND);

        this.message = message;
    }
};
