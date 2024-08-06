import Packet, { PacketDestination } from './packet';
import { Socket } from 'socket.io';
import { clientSocket } from '../../../client/js/controllers/connection';
import ServerPacket from './server-packet';
import ServerClient from '../../../server/objects/server-client';
import ResponsePacket from './response-packet';
import ClientPacket from './client-packet';
import { cli } from 'webpack';
import { response } from 'express';
import { Client } from 'node-mailjet';

let nextID = 0;

export default abstract class ReplyableClientPacket<T> extends ClientPacket {
	public packetID: number = nextID++;
	public clients: ServerClient[] = [];

	protected constructor(packetTypeID: number) {
		super(packetTypeID);
	}

	// sendToServer(clientSocket: Socket): Promise<T> {
	// 	return new Promise<T>(resolve => {
	// 		const packetHandler = (packet: ResponsePacket<T>) => {
	// 			if (packet.responseID !== this.packetID) return;
	// 			clientSocket.off('packet', packetHandler);
	// 			resolve(packet.replyData);
	// 		};
	// 		clientSocket.on('packet', packetHandler);
	// 		clientSocket.emit('packet', this);
	// 	});
	// }

	addClient(client: ServerClient) {
		this.clients.push(client);
	}

	sendToClients(): [ServerClient, Promise<T>][] {
		let result: [ServerClient, Promise<T>][] = [];
		this.clients.forEach((client) => {
			result.push([
				client,
				new Promise<T>((resolve) => {
					if (!client.isConnected) return;

					let packetData = { ...this };
					packetData.clients = [];

					const packetHandler = (packet: ResponsePacket<T>) => {
						if (packet.responseID !== this.packetID) return;
						client.socket.off('packet', packetHandler);
						resolve(packet.replyData);
					};

					client.socket.on('packet', packetHandler);
					client.socket.emit('packet', packetData);
				}),
			]);
		});
		return result;
	}
}
