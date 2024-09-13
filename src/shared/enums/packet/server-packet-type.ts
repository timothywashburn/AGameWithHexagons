import CustomEnum, { EnumValue } from '../custom-enum';

export class ServerPacketTypeEnum extends CustomEnum<ServerPacketType> {
	constructor() {
		super();
	}

	public DEV = this.addValue(new ServerPacketType());
	public CHAT = this.addValue(new ServerPacketType());
	public SPAWN = this.addValue(new ServerPacketType());
	public END_TURN = this.addValue(new ServerPacketType());
}

export class ServerPacketType extends EnumValue {
	constructor() {
		super();
	}
}
