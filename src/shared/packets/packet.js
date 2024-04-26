class Packet {
	clients = [];

	constructor(id, type) {
		this.id = id;
		this.type = type;
	}

	addClient(client) {
		this.clients.push(client);
	}

	send() {
		if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
			this.clients.forEach((client) => {
				let packetData = { ...this };
				delete packetData.clients;
				client.socket.emit('packet', packetData);
			});
		} else window.socket.emit('packet', this);
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
