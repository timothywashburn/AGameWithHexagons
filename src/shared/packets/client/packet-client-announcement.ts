import Packet, { PacketDestination, ClientPacketID } from '../base/packet';
import ClientPacket from '../base/client-packet';

export default class PacketClientAnnouncement extends ClientPacket {
	public clientID: number;
	public announcementID: number;

	constructor(clientID: number, announcementID: number) {
		super(ClientPacketID.ANNOUNCEMENT.id);

		this.clientID = clientID;
		this.announcementID = announcementID;
	}
};
