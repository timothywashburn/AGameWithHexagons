import { Socket } from 'socket.io';
import ServerClient from '../../server/objects/server-client';
import {NameChangeResponseData} from '../enums';

export default class Packet {
	public clients: ServerClient[] = [];

	public id: number;
	public type: PacketType;

	constructor(id: number, type: PacketType) {
		this.id = id;
		this.type = type;
	}

	addClient(client: ServerClient) {
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

export function getPacket(id: number): PacketData | null {
	for (let packetName in ClientPacket) {
		if (ClientPacket[packetName].id === id) {
			return ClientPacket[packetName];
		}
	}

	for (let packetName in ServerPacket) {
		if (ServerPacket[packetName].id === id) {
			return ServerPacket[packetName];
		}
	}

	return null;
}

export enum PacketType {
	SERVER_BOUND = 'SERVER_BOUND',
	CLIENT_BOUND = 'CLIENT_BOUND',
}

interface PacketData {
	id: number
}

export const ClientPacket: Readonly<{ [key: string]: PacketData }> = Object.freeze({
	GAME_INIT: { id: 0x01 },
	GAME_SNAPSHOT: { id: 0x02 },
	PLAYER_LIST_INFO: { id: 0x04 },
	CHAT: { id: 0x06 },
	ANNOUNCEMENT: { id: 0x07 },
});

export const ServerPacket: Readonly<{ [key: string]: PacketData }> = Object.freeze({
	CHAT: { id: 0x05 },
});