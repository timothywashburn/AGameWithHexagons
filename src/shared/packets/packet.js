class Packet {
	constructor(id, type) {
		this.id = id;
		this.clients = [];
		this.type = type;
	}

	addClient(client) {
		this.clients.push(client);
	}

	send(socket) {
		console.log('emitting!');
		socket.emit('packet', this);
	}
}

const PacketType = Object.freeze({
	SERVER_BOUND: 'SERVER_BOUND',
	CLIENT_BOUND: 'CLIENT_BOUND',
});

module.exports = {
	Packet,
	PacketType,
};
