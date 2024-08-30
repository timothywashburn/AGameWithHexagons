import CustomEnum, { EnumValue } from '../custom-enum';
import { NameChangeResponse } from './name-change-response';

export class PasswordChangeResponseEnum extends CustomEnum<PasswordChangeResponse> {
	constructor() {
		super();
	}

	public SUCCESS = this.addValue(new NameChangeResponse('Password changed successfully'));
	public PASSWORD_INCORRECT = this.addValue(new NameChangeResponse('Incorrect password'));
	public INSECURE_PASSWORD = this.addValue(new NameChangeResponse('Password is insecure'));
	public ERROR = this.addValue(new NameChangeResponse('Error changing password'));
}

export class PasswordChangeResponse extends EnumValue {
	public message: string;

	constructor(message: string) {
		super();
		this.message = message;
	}
}
