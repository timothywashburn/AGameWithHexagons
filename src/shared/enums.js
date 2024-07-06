exports.NameErrorType = Object.freeze({
	BAD_NAME: { id: 0x01, message: 'Illegal Name' },
	TOO_SHORT: { id: 0x02, message: 'Name Too Short (3 Characters Minimum)' },
	TOO_LONG: { id: 0x03, message: 'Name Too Long (30 Characters Maximum)' },
});

exports.AnnouncementType = Object.freeze({
	GAME_JOIN: { id: 0x01, message: 'Joined the game', color: 'green'},
	GAME_LEAVE: { id: 0x02, message: 'Left the game', color: 'red'},
});

exports.RegistrationError = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Account created successfully' },
	USERNAME_EXISTS: { id: 0x01, message: 'Username already exists' },
	USERNAME_INVALID: { id: 0x02, message: 'Invalid username' },
	PASSWORD_INVALID: { id: 0x03, message: 'Invalid password' },
});

class Color {
	constructor(red, green, blue) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
}

exports.TerrainType = Object.freeze({
	PLAIN: {
		color: new Color(134, 44, 54)
	},
	WATER: 1,
	MOUNTAIN: 2
});

exports.ResourceType = Object.freeze({
	NONE: 0,
	DEPLETABLE: 1,
	DEPLETABLE_LARGE: 2,
	RENEWABLE: 3
});
