const ejs = require('ejs');
const fs = require('fs');

const { isDev } = require('./utils');
const { Client, globalClients } = require('./client');
const GameLobby = require('./game-lobby');
const {generateToken, validateUser} = require("./authentication");
const PacketClientGameInit = require("../shared/packets/packet-client-game-init");
const {AnnouncementType} = require("../shared/enums");
const config = require("./config.json");

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

		console.log(isDev);
		if (isDev) responseData.dev = config.dev;

		fs.readFile(`${__dirname}/../client/views/partials/lobby-info.ejs`, 'utf8', (err, file) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			responseData.html = ejs.render(file, { data: responseData });
			res.json(responseData);
		});
	},

	async join(req, res) {
		const lobbyId = req.query.lobby;
		const socketId = req.query.socketId;
		const token= req.headers.authorization.split(' ')[1];

		const { validateUser } = require('./authentication');

		let client = globalClients.find((client) => client.id === socketId);
		if (!client) return;

		let lobby = GameLobby.getLobby(lobbyId);
		if (!lobby || lobby.clients.includes(socketId) || lobby.clients.length >= lobby.maxPlayers) return;

		let valid = token && await validateUser(token, client);

		res.json({
			success: true,
			message: 'Successfully joined the lobby',
			authenticated: valid,
			lobbyId,
			socketId,
		});

		lobby.addClient(client);

		const server = require('./server');
		const PacketClientGameInit = require('../shared/packets/packet-client-game-init');

		let isDev = process.env.NODE_ENV === 'development';
		let packet = new PacketClientGameInit(isDev);
		// let packet = new PacketClientGameInit(false);
		packet.addClient(client);

		packet.send(server);
	},

	register(req, res) {
		const username = req.query.username;
		const password = req.query.password;

		if(!username || !password) {
			res.json({
				success: false,
				result: 'Invalid username or password',
			});
			return;
		}

		const { createAccount, generateToken } = require('./authentication');


		createAccount(username, password)
			.then(async result => {
				res.json({
					success: result === 0x00,
					result: result,
					token: result === 0x00 ? await generateToken(username) : null,
				});
			})
			.catch(error => {
				console.error('Error creating account:', error);
				res.json({
					success: false,
					result: error,
				});
			});
	},

	login(req, res) {
		const username = req.query.username;
		const password = req.query.password;

		if(!username || !password) {
			res.json({
				success: false,
				result: 'Invalid username or password',
			});
			return;
		}

		const { attemptLogin, generateToken } = require('./authentication');

		attemptLogin(username, password)
			.then(async result => {
				res.json({
					success: result,
					token: result === true ? await generateToken(username) : null,
				});
			})
			.catch(error => {
				console.error('Error logging in:', error);
				res.json({
					success: false
				});
			});
	},

	logout(req, res) {

		console.log('Logging out');

		const token= req.headers.authorization.split(' ')[1];
		const { validate, logout } = require('./authentication');
		let valid = token && validate(token);

		if(valid) logout(token)
			.then(async result => {

				res.json({
					success: result,
				});
			})
			.catch(error => {
				console.error('Error logging out:', error);
				res.json({
					success: false
				});
			});
	}
};
