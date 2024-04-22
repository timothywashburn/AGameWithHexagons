const ejs = require('ejs');
const fs = require('fs');

const GameLobby = require('./game-lobby');

module.exports = {
	lobbydata(req, res) {
		console.log('lobby data requested');
		let responseData = {
			success: true,
			lobbies: GameLobby.lobbies.map((lobby) => {
				return {
					name: lobby.getName(),
					joinable: lobby.isJoinable(),
					players: lobby.clients.length,
					maxPlayers: lobby.maxPlayers,
				};
			}),
		};

		fs.readFile(`${__dirname}/../client/views/partials/lobby-info.ejs`, 'utf8', (err, file) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			responseData.html = ejs.render(file, { data: responseData });
			res.json(responseData);
		});
	},

	join(req, res) {
		const lobbyId = req.query.lobby;
		const socketId = req.query.socketId;

		res.json({
			message: 'Successfully joined the lobby',
			lobbyId,
			socketId,
		});

		let lobby = GameLobby.getLobby(lobbyId);
		lobby.addClient(socketId);
	},
};
