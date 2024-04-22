const GameLobby = require('./game-lobby');

module.exports = {
	lobbydata(req, res) {
		console.log('lobby data requested')
		res.json({
			success: true,
			lobbies: GameLobby.lobbies.map(lobby => {
				return {
					name: lobby.getName(),
					joinable: lobby.isJoinable(),
					players: lobby.clients.length,
					maxPlayers: lobby.maxPlayers
				}
			})
		});
	},

	join(req, res) {
		const lobbyId = req.query.lobby;
			const socketId = req.query.socketId;

		res.json({ message: 'Successfully joined the lobby', lobbyId, socketId });

		let lobby = GameLobby.getLobby(lobbyId);
		lobby.addClient(socketId);
	}
}
