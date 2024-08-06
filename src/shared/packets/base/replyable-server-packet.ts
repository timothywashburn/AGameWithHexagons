import Packet, { PacketDestination } from './packet';
import { Socket } from 'socket.io';
import { clientSocket } from '../../../client/js/controllers/connection';
import ServerPacket from './server-packet';
import ServerClient from '../../../server/objects/server-client';
import ResponsePacket from './response-packet';

let nextID = 0;

export default abstract class ReplyableServerPacket<T> extends ServerPacket {
	public packetID: number = nextID++;

	protected constructor(packetTypeID: number) {
		super(packetTypeID);
	}

	async sendToServer(clientSocket: Socket): Promise<T> {
		clientSocket.emit('packet', this);
		return new Promise<T>((resolve) => {
			const packetHandler = (packet: ResponsePacket<T>) => {
				if (packet.responseID !== this.packetID) return;
				clientSocket.off('packet', packetHandler);
				resolve(packet.replyData);
			};
			clientSocket.on('packet', packetHandler);
		});
	}
}
