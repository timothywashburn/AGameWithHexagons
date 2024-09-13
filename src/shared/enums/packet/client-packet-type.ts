import CustomEnum, { EnumValue } from '../custom-enum';

export class ClientPacketTypeEnum extends CustomEnum<ClientPacketType> {
	constructor() {
		super();
	}

	public DEV = this.addValue(new ClientPacketType());
	public SOCKET_RESPONSE = this.addValue(new ClientPacketType());
	public GAME_INIT = this.addValue(new ClientPacketType());
	public PLAYER_LIST_INFO = this.addValue(new ClientPacketType());
	public CHAT = this.addValue(new ClientPacketType());
	public ANNOUNCEMENT = this.addValue(new ClientPacketType());
	public TURN_START = this.addValue(new ClientPacketType());
}

export class ClientPacketType extends EnumValue {
	constructor() {
		super();
	}
}
