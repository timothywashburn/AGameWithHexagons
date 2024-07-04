let games = [];

module.exports = {
	games: games,

	getGame: (gameID) => {
		return games[gameID];
	}
}