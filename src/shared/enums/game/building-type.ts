import CustomEnum, { EnumValue } from '../custom-enum';

export class BuildingTypeEnum extends CustomEnum<BuildingType> {
	constructor() {
		super();
	}

	public TOWER = this.addValue(new BuildingType('Tower'));
}

export class BuildingType extends EnumValue {
	public displayName: string;

	constructor(displayName: string) {
		super();
		this.displayName = displayName;
	}
}
