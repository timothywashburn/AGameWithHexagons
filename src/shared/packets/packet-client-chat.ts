import Packet, { PacketType, ClientPacket } from './packet';

export default class PacketClientChat extends Packet {
    clientID: number;
    message: string;

    constructor(clientID: number, message: string) {
        super(ClientPacket.CHAT.id, PacketType.CLIENT_BOUND);

        this.clientID = clientID;
        this.message = message;
    }
};
