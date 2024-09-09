import ServerClient from '../../../server/objects/server-client';

export default class Packet {
	public clients: ServerClient[] = [];

	public packetTypeID: number;
	public packetDestination: PacketDestination;

	constructor(id: number, type: PacketDestination) {
		this.packetTypeID = id;
		this.packetDestination = type;
	}
}

export function getPacketName(id: number): string | null {
	for (let packetName in ClientPacketID) {
		if (ClientPacketID[packetName].id === id) return packetName;
	}

	for (let packetName in ServerPacketID) {
		if (ServerPacketID[packetName].id === id) return packetName;
	}

	return null;
}

export enum PacketDestination {
	SERVER_BOUND = 'SERVER_BOUND',
	CLIENT_BOUND = 'CLIENT_BOUND',
}

interface PacketData {
	id: number;
}

export const ClientPacketID: Readonly<{ [key: string]: PacketData }> = Object.freeze({
	DEV: { id: 0x00 },
	SOCKET_RESPONSE: { id: 0x01 },
	GAME_INIT: { id: 0x02 },
	GAME_SNAPSHOT: { id: 0x03 },
	PLAYER_LIST_INFO: { id: 0x04 },
	CHAT: { id: 0x05 },
	ANNOUNCEMENT: { id: 0x06 },
	TURN_START: { id: 0x07 },
});

export const ServerPacketID: Readonly<{ [key: string]: PacketData }> = Object.freeze({
	DEV: { id: 0x00 },
	CHAT: { id: 0x01 },
	SPAWN: { id: 0x02 },
	END_TURN: { id: 0x03 },
});
