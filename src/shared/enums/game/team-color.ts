import CustomEnum, { EnumValue } from '../custom-enum';

export class TeamColorEnum extends CustomEnum<TeamColor> {
	constructor() {
		super();
	}

	public RED = this.addValue(new TeamColor('rgb(255, 0, 0)'));
	public ORANGE = this.addValue(new TeamColor('rgb(255, 127, 0)'));
	public YELLOW = this.addValue(new TeamColor('rgb(255, 255, 0)'));
	public GREEN = this.addValue(new TeamColor('rgb(0, 255, 0)'));
	public CYAN = this.addValue(new TeamColor('rgb(0, 255, 255)'));
	public BLUE = this.addValue(new TeamColor('rgb(0, 0, 255)'));
	public PURPLE = this.addValue(new TeamColor('rgb(127, 0, 255)'));
	public MAGENTA = this.addValue(new TeamColor('rgb(255, 0, 255)'));
}

export class TeamColor extends EnumValue {
	public colorString: string;

	constructor(colorString: string) {
		super();
		this.colorString = colorString;
	}
}
