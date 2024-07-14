import { Socket } from 'socket.io';
import Client from '../../server/objects/client';

export default class Packet {
	public clients: Client[] = [];

	public id: number;
	public type: PacketType;

	constructor(id: number, type: PacketType) {
		this.id = id;
		this.type = type;
	}

	addClient(client: Client) {
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

	send(socket: Socket) {
		if(typeof window === 'undefined') {
			this.clients.forEach((client) => {
				let packetData = { ...this };
				packetData.clients = [];
				client.socket.emit('packet', packetData);
			});
		} else {
			socket.emit('packet', this);
		}
	}
}

export function getPacket(id: number) {
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

export enum PacketType {
	SERVER_BOUND = 'SERVER_BOUND',
	CLIENT_BOUND = 'CLIENT_BOUND',
}

export const ClientPacket = Object.freeze({
	GAME_INIT: { id: 0x01 },
	GAME_SNAPSHOT: { id: 0x02 },
	PLAYER_LIST_INFO: { id: 0x04 },
	CHAT: { id: 0x06 },
	ANNOUNCEMENT: { id: 0x07 },
});

export const ServerPacket = Object.freeze({
	CHAT: { id: 0x05 },
});