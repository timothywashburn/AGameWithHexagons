class Packet {

    constructor(id) {
        this.id = id;
        this.clients = [];
    }

    addClient(client) {
        this.clients.push(client);
    }

    send(socket) {
        socket.emit('packet', this);
    }
}

module.exports = Packet;