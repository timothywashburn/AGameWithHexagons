import {Server, Socket} from 'socket.io';
import ServerClient from '../../../server/objects/server-client';
import {NameChangeResponseData} from '../../enums';

export default class Packet {
	public clients: ServerClient[] = [];

	public id: number;
	public type: PacketType;

	constructor(id: number, type: PacketType) {
		this.id = id;
		this.type = type;
	}
}

export function getPacket(id: number): PacketData | null {
	for (let packetName in ClientPacketType) {
		if (ClientPacketType[packetName].id === id) {
			return ClientPacketType[packetName];
		}
	}

	for (let packetName in ServerPacketType) {
		if (ServerPacketType[packetName].id === id) {
			return ServerPacketType[packetName];
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

export const ClientPacketType: Readonly<{ [key: string]: PacketData }> = Object.freeze({
	GAME_INIT: { id: 0x01 },
	GAME_SNAPSHOT: { id: 0x02 },
	PLAYER_LIST_INFO: { id: 0x04 },
	CHAT: { id: 0x06 },
	ANNOUNCEMENT: { id: 0x07 },
});

export const ServerPacketType: Readonly<{ [key: string]: PacketData }> = Object.freeze({
	CHAT: { id: 0x05 },
});