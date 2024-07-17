import ServerGame from "../objects/server-game";
import ServerClient from "../objects/server-client";
import { Request, Response } from 'express';
import {
	EmailChangeResponseData,
	NameChangeResponseData,
	PasswordChangeResponseData,
	RegistrationResponseData
} from '../../shared/enums';
import {Query} from 'mysql';
import {Server} from 'http';

const ejs = require('ejs');
const fs = require('fs');

const { isDev } = require('../misc/utils');
const { getGame } = require('../controllers/game-client-manager');
// TODO: Cleanup
const { generateToken, validateUser, getAccountInfo, logout, changeUsername, changeEmail, changePassword,
	requestPasswordReset, requestUsername, sendEmailVerification, verifyEmail
} = require("../authentication");
const PacketClientGameInit = require("../../shared/packets/packet-client-game-init");
const { AnnouncementType, NameChangeResponseData, EmailChangeResponseData, PasswordChangeResponseData, ToastMessage} = require("../../shared/enums");
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
			games: ServerGame.gameList.map((game: ServerGame) => {
				return {
					id: game.id,
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
		const gameID = parseInt(req.query.gameID as string);
		const socketID = req.query.socketID;
		const token = req.headers.authorization!.split(' ')[1];

		let client = ServerClient.clientList.find((client: ServerClient) => client.socket.id === socketID);
		if (!client) {
			res.json({
				success: false,
				alert: false,
				message: "Could not find your client"
			});
			return;
		}

		let isAuthenticated = token && await validateUser(token, client);

		let game = ServerGame.getGame(gameID);
		if (!game) {
			res.json({
				success: false,
				alert: false,
				message: "This is not a valid game"
			});
			return;
		} else if (game.clientManager.clients.find((testClient: ServerClient) => testClient.getID() === client.getID())) {
			res.json({
				success: false,
				alert: true,
				message: "You are already in this game"
			});
			return;
		} else if (game.clientManager.clients.length >= game.clientManager.maxPlayers) {
			res.json({
				success: false,
				alert: true,
				message: "This game is already full"
			});
			return;
		}

		await game.clientManager.addClientToGame(client);
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
			.then(async (result: RegistrationResponseData) => {
				res.json({
					success: result.id === 0x00,
					result: result.id,
					token: result.id === 0x00 ? await generateToken(username) : null,
				});
			})
			.catch((error: unknown) => {
				console.error('Error creating account:');
				console.error(error);
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
			.then(async (result: boolean) => {
				res.json({
					success: result,
					token: result ? await generateToken(username) : null,
				});
			})
			.catch((error: unknown) => {
				console.error('Error logging in:');
				console.error(error);
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
			.then(async (result: boolean) => {

				res.json({
					success: result,
				});
			})
			.catch((error: unknown) => {
				console.error('Error logging out:');
				console.error(error);
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
			.then(async (result: object) => {
				res.json({
					success: true,
					info: result
				});
			})
			.catch((error: unknown) => {
				console.error('Error fetching account info:');
				console.error(error);
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
			.then(async (result: NameChangeResponseData) => {
				res.json({
					result: result.id
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing username');
				console.error(error);
				res.json({
					result: NameChangeResponseData.ERROR.id
				});
			});
		else res.json({
			result: NameChangeResponseData.ERROR.id
		});
	},

	async changeemail(req: Request, res: Response) {
		const token= req.headers.authorization!.split(' ')[1];
		let email = req.query.email;

		let valid = token && email && await validateUser(token, null);

		if(valid) changeEmail(token, email)
			.then(async (result: EmailChangeResponseData) => {
				res.json({
					result: result.id
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				res.json({
					result: EmailChangeResponseData.ERROR.id
				});
			});
		else res.json({
			result: EmailChangeResponseData.ERROR.id
		});
	},

	async changepassword(req: Request, res: Response) {

		const token= req.headers.authorization!.split(' ')[1];

		let oldPassword = req.query.oldPassword;
		let newPassword = req.query.newPassword;

		let valid = token && oldPassword && newPassword && await validateUser(token, null);

		if(valid) changePassword(token, oldPassword, newPassword)
			.then(async (result: PasswordChangeResponseData) => {
				res.json({
					result: result.id
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				res.json({
					result: PasswordChangeResponseData.ERROR.id
				});
			});
		else res.json({
			result: PasswordChangeResponseData.ERROR.id
		});
	},

	async resetpassword(req: Request, res: Response) {
		const token = req.query.token;
		const password = req.query.password;

		let valid = token && password && await validateUser(token);
		if(valid) changePassword(token, null, password, false)
			.then(async (result: PasswordChangeResponseData) => {
				res.json({
					result: result.id
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				res.json({
					result: PasswordChangeResponseData.ERROR.id
				});
			});
		else res.json({
			result: PasswordChangeResponseData.ERROR.id
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
				.then(async (result: boolean) => {
					res.redirect('/account?toast=' + (result ? ToastMessage.EMAIL_VERIFIED.id : ToastMessage.EMAIL_VERIFIED_ERROR.id));
				})
				.catch((error: unknown) => {
					res.redirect('/account?toast=' + ToastMessage.EMAIL_VERIFIED_ERROR.id);
					console.error('Error verifying account:');
					console.error(error);
				});
		} else {
			res.redirect('/account?toast=' + ToastMessage.EMAIL_VERIFIED_ERROR.id);
		}
	}
};
