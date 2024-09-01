import CustomEnum, { EnumValue } from '../custom-enum';

export class AnnouncementTypeEnum extends CustomEnum<AnnouncementType> {
	constructor() {
		super();
	}

	public GAME_JOIN = this.addValue(new AnnouncementType('Joined the game', 'green'));
	public GAME_LEAVE = this.addValue(new AnnouncementType('Left the game', 'red'));
}

export class AnnouncementType extends EnumValue {
	public message: string;
	public color: string;

	constructor(message: string, color: string) {
		super();
		this.message = message;
		this.color = color;
	}
}
