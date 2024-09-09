import CustomEnum, { EnumValue } from '../custom-enum';

export class BuildingTypeEnum extends CustomEnum<BuildingType> {
	constructor() {
		super();
	}

	public TOWER = this.addValue(new BuildingType('Tower', 'account'));
}

export class BuildingType extends EnumValue {
	public displayName: string;
	public spriteName: string;

	constructor(displayName: string, spriteName: string) {
		super();
		this.displayName = displayName;
		this.spriteName = spriteName;
	}
}
