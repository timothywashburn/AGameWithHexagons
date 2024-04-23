const { Packet, PacketType } = require('../packet.js');


class PacketClientGameInit extends Packet {
    constructor() {
        super(0x01, PacketType.CLIENT_BOUND);
    }
}

module.exports = PacketClientGameInit;