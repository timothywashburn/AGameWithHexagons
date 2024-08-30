import CustomEnum, { EnumValue } from '../custom-enum';
import { NameChangeResponse } from './name-change-response';

export class AccountToastMessageEnum extends CustomEnum<AccountToastMessage> {
	constructor() {
		super();
	}

	public EMAIL_VERIFIED = this.addValue(
		new AccountToastMessage('Your email has been successfully verified', 'green')
	);
	public EMAIL_VERIFIED_ERROR = this.addValue(
		new AccountToastMessage('Error verifying email. Link is likely expired', 'red')
	);
	public NAME_CHANGE_SUCCESS = this.addValue(new AccountToastMessage('Name changed successfully', 'green'));
	public EMAIL_CHANGE_SUCCESS = this.addValue(new AccountToastMessage('Email changed successfully', 'green'));
	public PASSWORD_CHANGE_SUCCESS = this.addValue(new AccountToastMessage('Password changed successfully', 'green'));
	public UNVERIFIED_EMAIL_WARN = this.addValue(
		new AccountToastMessage(
			'Your email is not verified. You will not be able to recover your account if you do not do so.' +
				' Make sure to check your spam folder for the email.',
			'orange'
		)
	);
	public NO_EMAIL_WARN = this.addValue(
		new AccountToastMessage(
			'You have not set an email. You will not be able to recover your account if you do not do so. Go to your Account ' +
				'Page to add an email.',
			'orange'
		)
	);
}

export class AccountToastMessage extends EnumValue {
	public message: string;
	public color: string;

	constructor(message: string, color: string) {
		super();
		this.message = message;
		this.color = color;
	}
}
