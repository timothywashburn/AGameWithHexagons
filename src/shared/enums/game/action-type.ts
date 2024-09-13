import CustomEnum, { EnumValue } from '../custom-enum';

export class ActionTypeEnum extends CustomEnum<ActionType> {
	constructor() {
		super();
	}

	public CREATE_UNIT = this.addValue(new ActionType());
	public DESTROY_UNIT = this.addValue(new ActionType());
	public MOVE = this.addValue(new ActionType());
	public ATTACK = this.addValue(new ActionType());
	public USE_ABILITY = this.addValue(new ActionType());
}

export class ActionType extends EnumValue {
	constructor() {
		super();
	}
}
