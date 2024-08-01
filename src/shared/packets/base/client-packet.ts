import {Socket} from 'socket.io';
import ServerClient from '../../../server/objects/server-client';
import Packet, {PacketDestination} from './packet';

export default class ClientPacket extends Packet {
	public clients: ServerClient[] = [];

	constructor(id: number) {
		super(id, PacketDestination.CLIENT_BOUND);
	}

	addClient(client: ServerClient) {
		this.clients.push(client);
	}

	sendToClients() {
		this.clients.forEach((client) => {
			let packetData = { ...this };
			packetData.clients = [];
			client.socket.emit('packet', packetData);
		});
	}
}