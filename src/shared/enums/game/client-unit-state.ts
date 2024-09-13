import CustomEnum, { EnumValue } from '../custom-enum';

export class ClientUnitStateEnum extends CustomEnum<ClientUnitState> {
	constructor() {
		super();
	}

	public PLANNED_BUILD = this.addValue(new ClientUnitState());
	public PLANNED_DESTROY = this.addValue(new ClientUnitState());
}

export class ClientUnitState extends EnumValue {
	constructor() {
		super();
	}
}
