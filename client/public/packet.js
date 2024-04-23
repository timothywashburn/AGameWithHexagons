class   Packet {

    constructor(id, type) {
        this.id = id;
        this.clients = [];
        this.type = type;
    }

    addClient(client) {
        this.clients.push(client);
    }

    send(socket) {
        socket.emit('packet', this);
    }
}

const PacketType = Object.freeze({
    SERVER_BOUND: 'SERVER_BOUND',
    CLIENT_BOUND: 'CLIENT_BOUND'
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { Packet, PacketType };
} else {
    window.Packet = Packet;
    window.PacketType = PacketType;
}