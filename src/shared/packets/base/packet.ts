import ServerClient from '../../../server/objects/server-client';

export default class Packet {
	public clients: ServerClient[] = [];

	public packetTypeIndex: number;
	public packetDestination: number;

	constructor(packetTypeIndex: number, packetDestinationIndex: number) {
		this.packetTypeIndex = packetTypeIndex;
		this.packetDestination = packetDestinationIndex;
	}
}
