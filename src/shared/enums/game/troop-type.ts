import CustomEnum, { EnumValue } from '../custom-enum';

export class TroopTypeEnum extends CustomEnum<TroopType> {
	constructor() {
		super();
	}

	public MELEE = this.addValue(new TroopType('Melee'));
	public RANGED = this.addValue(new TroopType('Ranged'));
}

export class TroopType extends EnumValue {
	public displayName: string;

	constructor(displayName: string) {
		super();
		this.displayName = displayName;
	}
}
