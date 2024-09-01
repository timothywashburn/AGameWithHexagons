import CustomEnum, { EnumValue } from '../custom-enum';
import { NameChangeResponse } from './name-change-response';

export class EmailChangeResponseEnum extends CustomEnum<EmailChangeResponse> {
	constructor() {
		super();
	}

	public SUCCESS = this.addValue(new NameChangeResponse('Email changed successfully'));
	public EMAIL_EXISTS = this.addValue(new NameChangeResponse('Email is already linked to another account'));
	public EMAIL_INVALID = this.addValue(new NameChangeResponse('Invalid email'));
	public ERROR = this.addValue(new NameChangeResponse('Error changing email'));
}

export class EmailChangeResponse extends EnumValue {
	public message: string;

	constructor(message: string) {
		super();
		this.message = message;
	}
}
