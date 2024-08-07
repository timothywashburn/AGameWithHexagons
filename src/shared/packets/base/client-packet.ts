import ServerClient from '../../../server/objects/server-client';
import Packet, { PacketDestination } from './packet';

export default abstract class ClientPacket extends Packet {
	public clients: ServerClient[] = [];

	protected constructor(id: number) {
		super(id, PacketDestination.CLIENT_BOUND);
	}

	addClient(client: ServerClient) {
		this.clients.push(client);
	}

	sendToClients() {
		this.clients.forEach((client) => {
			if (!client.isConnected) return;
			let packetData = { ...this };
			packetData.clients = [];
			client.socket.emit('packet', packetData);
		});
	}
}
