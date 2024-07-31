import { ServerPacketType } from '../base/packet';
import ServerPacket from '../base/server-packet';

export default class PacketServerChat extends ServerPacket {
    public message: string;

    constructor(message: string) {
        super(ServerPacketType.CHAT.id);

        this.message = message;
    }
};
