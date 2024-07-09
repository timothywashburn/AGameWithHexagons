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

exports.NameChangeError = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Name changed successfully' },
	USERNAME_EXISTS: { id: 0x01, message: 'Username already exists' },
	USERNAME_INVALID: { id: 0x02, message: 'Invalid username' },
	ERROR: { id: 0x03, message: 'Error changing name' },
});

exports.EmailChangeError = Object.freeze({
	SUCCESS: { id: 0x00, message: 'Email changed successfully' },
	EMAIL_EXISTS: { id: 0x01, message: 'Email is already linked to another account' },
	EMAIL_INVALID: { id: 0x02, message: 'Invalid email' },
	ERROR: { id: 0x03, message: 'Error changing email' },
});

exports.TeamColor = Object.freeze({
	RED: "rgb(255, 0, 0)",
	ORANGE: "rgb(255, 127, 0)",
	YELLOW: "rgb(255, 255, 0)",
	GREEN: "rgb(0, 255, 0)",
	CYAN: "rgb(0, 255, 255)",
	BLUE: "rgb(0, 0, 255)",
	PURPLE: "rgb(127, 0, 255)",
	MAGENTA: "rgb(255, 0, 255)"
});

// exports.TerrainType = Object.freeze({
// 	PLAIN: {
// 		color: new Color(134, 44, 54)
// 	},
// 	WATER: 1,
// 	MOUNTAIN: 2
// });
//
// exports.ResourceType = Object.freeze({
// 	NONE: 0,
// 	DEPLETABLE: 1,
// 	DEPLETABLE_LARGE: 2,
// 	RENEWABLE: 3
// });
