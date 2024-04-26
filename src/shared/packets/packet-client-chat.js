const { Packet, PacketType } = require('./packet');

module.exports = class PacketClientChat extends Packet {
    constructor(clientID, message) {
        super(0x06, PacketType.CLIENT_BOUND);
        this.clientID = clientID;
        this.message = message;
    }
};
