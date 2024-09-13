import CustomEnum, { EnumValue } from '../custom-enum';

export class PacketDestinationEnum extends CustomEnum<PacketDestination> {
	constructor() {
		super();
	}

	public CLIENT_BOUND = this.addValue(new PacketDestination());
	public SERVER_BOUND = this.addValue(new PacketDestination());
}

export class PacketDestination extends EnumValue {
	constructor() {
		super();
	}
}
