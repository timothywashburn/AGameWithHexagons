import ClientPacket from '../base/client-packet';
import Enum from '../../enums/enum';

export default class PacketClientAnnouncement extends ClientPacket {
	public clientID: number;
	public announcementID: number;

	constructor(clientID: number, announcementID: number) {
		super(Enum.ClientPacketType.ANNOUNCEMENT.getIndex());

		this.clientID = clientID;
		this.announcementID = announcementID;
	}
}
