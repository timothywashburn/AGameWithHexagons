import ServerGame from "../objects/server-game";
import Client from "../objects/client";
import { Request, Response } from 'express';

const ejs = require('ejs');
const fs = require('fs');

const { isDev } = require('../misc/utils');
const { games, getGame } = require('../controllers/game-manager');
// TODO: Cleanup
const { generateToken, validateUser, getAccountInfo, logout, changeUsername, changeEmail, changePassword,
	requestPasswordReset, requestUsername, sendEmailVerification, verifyEmail
} = require("../authentication");
const PacketClientGameInit = require("../../shared/packets/packet-client-game-init");
const { AnnouncementType, NameChangeError, EmailChangeError, PasswordChangeError, ToastMessage} = require("../../shared/enums");
const config = require("../../../config.json");
const server = require('../server');
const { sendResetEmail } = require("../controllers/mail");

module.exports = {
	async gamedata(req: Request, res: Response) {
		const token = req.headers.authorization!.split(' ')[1];
		let valid = token && await validateUser(token, null);

		console.log('game data requested');
		let responseData = {
			success: true,
			authenticated: valid,
			games: games.map((game: ServerGame) => {
				return {
					name: game.getName(),
					joinable: game.isJoinable(),
					players: game.clientManager.clients.length,
					maxPlayers: game.clientManager.maxPlayers,
				};
			}),
			dev: undefined,
			html: undefined
		};

		if (isDev) responseData.dev = config.dev;

		fs.readFile(`${__dirname}/../../client/views/partials/game-info.ejs`, 'utf8',
			(err: NodeJS.ErrnoException, file: string) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			responseData.html = ejs.render(file, { data: responseData });
			res.json(responseData);
		});
	},

	async join(req: Request, res: Response) {
		const gameID = req.query.gameID;
		const socketID = req.query.socketID;
		const token = req.headers.authorization!.split(' ')[1];

		let client = Client.clientList.find((client: Client) => client.socket.id === socketID);
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
		} else if (game.clientManager.clients.find((testClient: Client) => testClient.getID() === client.getID())) {
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

	register(req: Request, res: Response) {
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

	login(req: Request, res: Response) {
		//TODO: Implement rate limits and captcha?

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

	async logout(req: Request, res: Response) {
		console.error('Logging out:', req.headers.authorization!.split(' ')[1]);

		const token= req.headers.authorization!.split(' ')[1];
		let valid = token && await validateUser(token, null);

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
		else res.json({
			success: false
		});
	},

	async account(req: Request, res: Response) {

		const token= req.headers.authorization!.split(' ')[1];
		let valid = token && await validateUser(token, null);

		if(valid) getAccountInfo(token)
			.then(async result => {
				res.json({
					success: true,
					info: result[0]
				});
			})
			.catch(error => {
				console.error('Error fetching account info:', error);
				res.json({
					success: false
				});
			});
		else res.json({
			success: false
		});
	},

	async changeusername(req: Request, res: Response) {

		const token= req.headers.authorization!.split(' ')[1];
		let username = req.query.username;

		let valid = token && username && await validateUser(token, null);

		if(valid) changeUsername(token, username)
			.then(async result => {
				res.json({
					result: result
				});
			})
			.catch(error => {
				console.error('Error changing username:', error);
				res.json({
					result: NameChangeError.ERROR.id
				});
			});
		else res.json({
			result: NameChangeError.ERROR.id
		});
	},

	async changeemail(req: Request, res: Response) {
		const token= req.headers.authorization!.split(' ')[1];
		let email = req.query.email;

		let valid = token && email && await validateUser(token, null);

		if(valid) changeEmail(token, email)
			.then(async result => {
				res.json({
					result: result
				});
			})
			.catch(error => {
				console.error('Error changing email:', error);
				res.json({
					result: EmailChangeError.ERROR.id
				});
			});
		else res.json({
			result: EmailChangeError.ERROR.id
		});
	},

	async changepassword(req: Request, res: Response) {

		const token= req.headers.authorization!.split(' ')[1];

		let oldPassword = req.query.oldPassword;
		let newPassword = req.query.newPassword;

		let valid = token && oldPassword && newPassword && await validateUser(token, null);

		if(valid) changePassword(token, oldPassword, newPassword)
			.then(async result => {
				res.json({
					result: result
				});
			})
			.catch(error => {
				console.error('Error changing email:', error);
				res.json({
					result: PasswordChangeError.ERROR.id
				});
			});
		else res.json({
			result: PasswordChangeError.ERROR.id
		});
	},

	async resetpassword(req: Request, res: Response) {
		const token = req.query.token;
		const password = req.query.password;

		let valid = token && password && await validateUser(token);
		if(valid) changePassword(token, null, password, false)
			.then(async result => {
				res.json({
					result: result
				});
			})
			.catch(error => {
				console.error('Error changing email:', error);
				res.json({
					result: PasswordChangeError.ERROR.id
				});
			});
		else res.json({
			result: PasswordChangeError.ERROR.id
		});
	},

	async forgotpassword(req: Request, res: Response) {
		const email = req.query.email;
		await requestPasswordReset(email);

		res.json({
			success: true
		});
	},

	async forgotusername(req: Request, res: Response) {
		const email = req.query.email;
		await requestUsername(email);

		res.json({
			success: true
		});
	},

	async resendverification(req: Request, res: Response) {
		const token = req.headers.authorization!.split(' ')[1];
		let valid = token && await validateUser(token, null);

		if(valid) {
			await sendEmailVerification(token);
			res.json({
				success: true
			});
		} else {
			res.json({
				success: false
			});
		}
	},

	async verify(req: Request, res: Response) {
		const token = req.query.token;
		let valid = token && await validateUser(token, null);

		if(valid) {
			await verifyEmail(token)
				.then(async result => {
					res.redirect('/account?toast=' + (result ? ToastMessage.EMAIL_VERIFIED.id : ToastMessage.EMAIL_VERIFIED_ERROR.id));
				})
				.catch(error => {
					res.redirect('/account?toast=' + ToastMessage.EMAIL_VERIFIED_ERROR.id);
					console.error('Error verifying account:', error);

				});
		} else {
			res.redirect('/account?toast=' + ToastMessage.EMAIL_VERIFIED_ERROR.id);
		}
	}
};
