import ServerClient from '../../../server/objects/server-client';
import Packet from './packet';
import Enum from '../../enums/enum';

export default abstract class ClientPacket extends Packet {
	public clients: ServerClient[] = [];

	protected constructor(packetTypeIndex: number) {
		super(packetTypeIndex, Enum.PacketDestination.CLIENT_BOUND.getIndex());
	}

	addClient(client: ServerClient) {
		this.clients.push(client);
		return this;
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
