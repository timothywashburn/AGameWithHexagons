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

function getPacket(id) {
	for (let packetName in ClientPacket) {
		if (ClientPacket[packetName].id === id) {
			return packetName;
		}
	}

	for (let packetName in ServerPacket) {
		if (ServerPacket[packetName].id === id) {
			return packetName;
		}
	}

	return null;
}

const PacketType = Object.freeze({
	SERVER_BOUND: 'SERVER_BOUND',
	CLIENT_BOUND: 'CLIENT_BOUND',
});

const ClientPacket = Object.freeze({
	GAME_INIT: { id: 0x01 },
	GAME_SNAPSHOT: { id: 0x02 },
	PLAYER_LIST_INFO: { id: 0x04 },
	CHAT: { id: 0x06 },
	ANNOUNCEMENT: { id: 0x07 },
});

const ServerPacket = Object.freeze({
	CHAT: { id: 0x05 },
});

module.exports = {
	Packet,
	getPacket,
	PacketType,
	ClientPacket,
	ServerPacket
};
