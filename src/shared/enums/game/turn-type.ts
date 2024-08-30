import CustomEnum, { EnumValue } from '../custom-enum';

export class TurnTypeEnum extends CustomEnum<TurnType> {
	constructor() {
		super();
	}

	public DEVELOP = this.addValue(new TurnType('Develop'));
	public SIEGE = this.addValue(new TurnType('Siege'));
}

export class TurnType extends EnumValue {
	public displayName: string;

	constructor(displayName: string) {
		super();
		this.displayName = displayName;
	}
}
