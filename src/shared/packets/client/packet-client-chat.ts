import Packet, { PacketType, ClientPacketType } from '../base/packet';
import ClientPacket from '../base/client-packet';

export default class PacketClientChat extends ClientPacket {
    clientID: number;
    message: string;

    constructor(clientID: number, message: string) {
        super(ClientPacketType.CHAT.id);

        this.clientID = clientID;
        this.message = message;
    }
};
