import CustomEnum, { EnumValue } from '../custom-enum';

export class TroopTypeEnum extends CustomEnum<TroopType> {
	constructor() {
		super();
	}

	public MELEE = this.addValue(new TroopType('Melee', 'test'));
	public RANGED = this.addValue(new TroopType('Ranged', 'warn'));
}

export class TroopType extends EnumValue {
	public displayName: string;
	public spriteName: string;

	constructor(displayName: string, spriteName: string) {
		super();
		this.displayName = displayName;
		this.spriteName = spriteName;
	}
}
