import CustomEnum, { EnumValue } from '../custom-enum';
import { NameChangeResponse } from './name-change-response';

export class RegistrationResponseEnum extends CustomEnum<RegistrationResponse> {
	constructor() {
		super();
	}

	public SUCCESS = this.addValue(new NameChangeResponse('Account created successfully'));
	public USERNAME_EXISTS = this.addValue(new NameChangeResponse('Username already exists'));
	public USERNAME_INVALID = this.addValue(new NameChangeResponse('Invalid username'));
	public PASSWORD_INVALID = this.addValue(new NameChangeResponse('Invalid password'));
}

export class RegistrationResponse extends EnumValue {
	public message: string;

	constructor(message: string) {
		super();
		this.message = message;
	}
}
