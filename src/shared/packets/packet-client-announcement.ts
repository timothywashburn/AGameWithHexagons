import Packet, { PacketType, ClientPacket } from './packet';

export default class PacketClientAnnouncement extends Packet {
	public clientID: number;
	public announcementID: number;

	constructor(clientID: number, announcementID: number) {
		super(ClientPacket.ANNOUNCEMENT.id, PacketType.CLIENT_BOUND);

		this.clientID = clientID;
		this.announcementID = announcementID;
	}
};
