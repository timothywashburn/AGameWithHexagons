class Packet {
	clients = [];

	constructor(id, type) {
		this.id = id;
		this.type = type;
	}

	addClient(client) {
		this.clients.push(client);
	}

	// send(socket) {
	// 	if (socket) {
	// 		socket.emit('packet', this);
	// 	} else {
	// 		let packetData = { ...this };
	// 		delete packetData.clients;
	// 		this.clients.forEach((client) => client.socket.emit('packet', packetData));
	// 	}
	// }

	send(socket) {
		if(typeof window === 'undefined') {
			this.clients.forEach((client) => {
				let packetData = { ...this };
				delete packetData.clients;
				client.socket.emit('packet', packetData);
			});
		} else {
			socket.emit('packet', this);
		}
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
