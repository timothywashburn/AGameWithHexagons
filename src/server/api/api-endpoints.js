const ejs = require('ejs');
const fs = require('fs');

const { isDev } = require('../misc/utils');
const { Client, globalClients } = require('../objects/client');
const { games, getGame } = require('../controllers/game-manager');
const {generateToken, validateUser} = require("../authentication");
const PacketClientGameInit = require("../../shared/packets/packet-client-game-init");
const {AnnouncementType} = require("../../shared/enums");
const config = require("../../../config.json");
const server = require('../server');

module.exports = {
	async gamedata(req, res) {
		const token = req.headers.authorization.split(' ')[1];
		let valid = token && await validateUser(token, null);

		console.log('game data requested');
		let responseData = {
			success: true,
			authenticated: valid,
			games: games.map((game) => {
				return {
					name: game.getName(),
					joinable: game.isJoinable(),
					players: game.clientManager.clients.length,
					maxPlayers: game.maxPlayers,
				};
			}),
		};

		if (isDev) responseData.dev = config.dev;

		fs.readFile(`${__dirname}/../../client/views/partials/game-info.ejs`, 'utf8', (err, file) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			responseData.html = ejs.render(file, { data: responseData });
			res.json(responseData);
		});
	},

	async join(req, res) {
		const gameID = req.query.game;
		const socketId = req.query.socketID;
		const token = req.headers.authorization.split(' ')[1];

		let client = globalClients.find((client) => client.socket.id === socketId);
		if (!client) {
			res.json({
				success: false,
				alert: false,
				message: "Could not find your client"
			});
			return;
		}

		let isAuthenticated = token && await validateUser(token, client);

		let game = getGame(gameID);
		if (!game) {
			res.json({
				success: false,
				alert: false,
				message: "This is not a valid game"
			});
			return;
		} else if (client.profile.id !== -1 && game.clientManager.clients.find(testClient => testClient.profile.id === client.profile.id)) {
			res.json({
				success: false,
				alert: true,
				message: "You are already in this game"
			});
			return;
		} else if (game.clientManager.clients.length >= game.maxPlayers) {
			res.json({
				success: false,
				alert: true,
				message: "This game is already full"
			});
			return;
		}

		let initData = {
			isAuthenticated
		}
		await game.clientManager.addClientToGame(client, initData);
	},

	register(req, res) {
		//TODO: Implement name restrictions

		const username = req.query.username;
		const password = req.query.password;

		if(!username || !password) {
			res.json({
				success: false,
				result: 'Invalid username or password',
			});
			return;
		}

		const { createAccount, generateToken } = require('../authentication');

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
		//TODO: Implement rate limits and

		const username = req.query.username;
		const password = req.query.password;

		if(!username || !password) {
			res.json({
				success: false,
				result: 'Invalid username or password',
			});
			return;
		}

		const { attemptLogin, generateToken } = require('../authentication');

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
		const { validate, logout } = require('../authentication');
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
