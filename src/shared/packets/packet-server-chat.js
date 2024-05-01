const { Packet, PacketType } = require('./packet');

module.exports = class PacketServerChat extends Packet {
    constructor(message) {
        super(0x05, PacketType.SERVER_BOUND);
        this.message = message;
    }
};
