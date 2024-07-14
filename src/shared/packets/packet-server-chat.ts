import Packet, { PacketType, ServerPacket } from './packet';

export default class PacketServerChat extends Packet {
    public message: string;

    constructor(message: string) {
        super(ServerPacket.CHAT.id, PacketType.SERVER_BOUND);

        this.message = message;
    }
};
