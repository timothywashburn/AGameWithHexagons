export const NameErrorType = Object.freeze({
	BAD_NAME: { id: 0x01, message: 'Illegal Name' },
	TOO_SHORT: { id: 0x02, message: 'Name Too Short (3 Characters Minimum)' },
	TOO_LONG: { id: 0x03, message: 'Name Too Long (30 Characters Maximum)' },
});

export interface AnnouncementTypeData {
	id: number;
	message: string;
	color: string;
}

export const AnnouncementType: Readonly<{ [key: string]: AnnouncementTypeData }> = Object.freeze({
	GAME_JOIN: { id: 0x01, message: 'Joined the game', color: 'green' },
	GAME_LEAVE: { id: 0x02, message: 'Left the game', color: 'red' },
});

export interface RegistrationResponseData {
	id: number;
	message: string;
}

export const RegistrationResponse: Readonly<{ [key: string]: RegistrationResponseData }> = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Account created successfully' },
	USERNAME_EXISTS: { id: 0x01, message: 'Username already exists' },
	USERNAME_INVALID: { id: 0x02, message: 'Invalid username' },
	PASSWORD_INVALID: { id: 0x03, message: 'Invalid password' },
});

export interface NameChangeResponseData {
	id: number;
	message: string;
}

export const NameChangeResponse: Readonly<{ [key: string]: NameChangeResponseData }> = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Name changed successfully' },
	USERNAME_EXISTS: { id: 0x01, message: 'Username already exists' },
	USERNAME_INVALID: { id: 0x02, message: 'Invalid username' },
	ERROR: { id: 0x03, message: 'Error changing name' },
});

export interface EmailChangeResponseData {
	id: number;
	message: string;
}

export const EmailChangeResponse: Readonly<{ [key: string]: EmailChangeResponseData }> = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Email changed successfully' },
	EMAIL_EXISTS: { id: 0x01, message: 'Email is already linked to another account' },
	EMAIL_INVALID: { id: 0x02, message: 'Invalid email' },
	ERROR: { id: 0x03, message: 'Error changing email' },
});

export interface PasswordChangeResponseData {
	id: number;
	message: string;
}

export const PasswordChangeResponse: Readonly<{ [key: string]: PasswordChangeResponseData }> = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Password changed successfully' },
	PASSWORD_INCORRECT: { id: 0x01, message: 'Incorrect password' },
	INSECURE_PASSWORD: { id: 0x02, message: 'Password is insecure' },
	ERROR: { id: 0x03, message: 'Error changing password' },
});

export const ToastMessage = Object.freeze({
	EMAIL_VERIFIED: { id: 0, message: 'Your email has been successfully verified', color: 'green' },
	EMAIL_VERIFIED_ERROR: { id: 1, message: 'Error verifying email. Link is likely expired.', color: 'red' },
	NAME_CHANGE_SUCCESS: { id: 2, message: 'Name changed successfully', color: 'green' },
	EMAIL_CHANGE_SUCCESS: { id: 3, message: 'Email changed successfully', color: 'green' },
	PASSWORD_CHANGE_SUCCESS: { id: 4, message: 'Password changed successfully', color: 'green' },
	UNVERIFIED_EMAIL_WARN: {
		id: 5,
		message:
			'Your email is not verified. You will not be able to recover your account if you do not do so.' +
			' Make sure to check your spam folder for the email.',
		color: 'orange',
	},
	NO_EMAIL_WARN: {
		id: 6,
		message:
			'You have not set an email. You will not be able to recover your account if you do not do so. Go to your Account ' +
			'Page to add an email.',
		color: 'orange',
	},
});

export const TeamColor = Object.freeze({
	RED: 'rgb(255, 0, 0)',
	ORANGE: 'rgb(255, 127, 0)',
	YELLOW: 'rgb(255, 255, 0)',
	GREEN: 'rgb(0, 255, 0)',
	CYAN: 'rgb(0, 255, 255)',
	BLUE: 'rgb(0, 0, 255)',
	PURPLE: 'rgb(127, 0, 255)',
	MAGENTA: 'rgb(255, 0, 255)',
});

// export const TerrainType = Object.freeze({
// 	PLAIN: {
// 		color: new Color(134, 44, 54)
// 	},
// 	WATER: 1,
// 	MOUNTAIN: 2
// });
//
// export const ResourceType = Object.freeze({
// 	NONE: 0,
// 	DEPLETABLE: 1,
// 	DEPLETABLE_LARGE: 2,
// 	RENEWABLE: 3
// });
