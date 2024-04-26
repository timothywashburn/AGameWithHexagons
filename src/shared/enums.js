const NameErrorType = Object.freeze({
	BAD_NAME: { code: 0x01, message: 'Illegal Name' },
	TOO_SHORT: { code: 0x02, message: 'Name Too Short (3 Characters Minimum)' },
	TOO_LONG: { code: 0x03, message: 'Name Too Long (30 Characters Maximum)' },
});

const AnnouncementType = Object.freeze({
	LOBBY_JOIN: { code: 0x01, message: 'Joined the Lobby', color: 'green'},
	LOBBY_LEAVE: { code: 0x02, message: 'Left the Lobby', color: 'red'},
});

module.exports = {
	NameErrorType,
	AnnouncementType,
};
