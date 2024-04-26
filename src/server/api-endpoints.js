const ejs = require('ejs');
const fs = require('fs');
const { Client, globalClients } = require('./client');

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
			success: true,
			message: 'Successfully joined the lobby',
			lobbyId,
			socketId,
		});

		let lobby = GameLobby.getLobby(lobbyId);
		if (!lobby || lobby.clients.includes(socketId) || lobby.clients.length >= lobby.maxPlayers) return;

		let client = globalClients.find((client) => client.id === socketId);
		if (!client) return;

		lobby.addClient(client);

		const server = require('./server');
		const PacketClientGameInit = require('../shared/packets/packet-client-game-init');

		let packet = new PacketClientGameInit();
		packet.addClient(client);

		packet.send(server);
	},
};
