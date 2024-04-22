const Packet = require('../packet.js');

class PacketClientGameInit extends Packet {
    constructor() {
        super(0x01);
    }
}

module.exports = PacketClientGameInit;