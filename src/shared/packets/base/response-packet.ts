import ServerClient from '../../../server/objects/server-client';
import { Socket } from 'socket.io';

export default class ResponsePacket<T> {
	public responseID: number;
	public replyData: T;

	constructor(replyID: number, replyData: T = null as any) {
		this.responseID = replyID;
		this.replyData = replyData;
	}

	replyToClient(client: ServerClient) {
		if (!client.isConnected) return;
		client.socket.emit('packet', this);
	}

	replyToServer(clientSocket: Socket) {
		clientSocket.emit('packet', this);
	}
}
