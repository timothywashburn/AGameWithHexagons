import Packet, {PacketType} from './packet';
import {Socket} from 'socket.io';

export default class ServerPacket extends Packet {

	constructor(id: number) {
		super(id, PacketType.SERVER_BOUND);
	}

	sendToServer(clientSocket: Socket) {
		clientSocket.emit('packet', this);
	}
}