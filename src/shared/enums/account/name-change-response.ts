import CustomEnum, { EnumValue } from '../custom-enum';

export class NameChangeResponseEnum extends CustomEnum<NameChangeResponse> {
	constructor() {
		super();
	}

	public SUCCESS = this.addValue(new NameChangeResponse('Name changed successfully'));
	public USERNAME_EXISTS = this.addValue(new NameChangeResponse('Username already exists'));
	public USERNAME_INVALID = this.addValue(new NameChangeResponse('Invalid username'));
	public ERROR = this.addValue(new NameChangeResponse('Error changing name'));
}

export class NameChangeResponse extends EnumValue {
	public message: string;

	constructor(message: string) {
		super();
		this.message = message;
	}
}
