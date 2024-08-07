import ServerGame from '../objects/server-game';
import ServerClient from '../objects/server-client';
import { Request, Response } from 'express';
import {
	EmailChangeResponse,
	EmailChangeResponseData,
	NameChangeResponse,
	NameChangeResponseData,
	PasswordChangeResponse,
	PasswordChangeResponseData,
	RegistrationResponseData,
	ToastMessage,
} from '../../shared/enums/misc-enums';

import fs from 'fs';
import ejs from 'ejs';
import * as auth from '../controllers/authentication';
import { isDev } from '../misc/utils';

import config from '../../../config.json';

export async function gamedata(req: Request, res: Response) {
	const token = req.headers.authorization!.split(' ')[1];
	let valid = token && (await auth.validateUser(token, null));

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
		dev: {},
		html: {},
	};

	if (isDev) responseData.dev = config.dev;

	fs.readFile(
		`${__dirname}/../../client/views/partials/game-info.ejs`,
		'utf8',
		(err: NodeJS.ErrnoException | null, file: string) => {
			if (err) {
				console.error('Error reading file:', err);
				return;
			}

			responseData.html = ejs.render(file, { data: responseData });
			res.json(responseData);
		},
	);
}

export async function join(req: Request, res: Response) {
	const gameID = parseInt(req.query.gameID as string);
	const socketID = req.query.socketID;
	const token = req.headers.authorization!.split(' ')[1];

	let client = ServerClient.clientList.find((client: ServerClient) => client.socket.id === socketID);
	if (!client) {
		res.json({
			success: false,
			alert: false,
			message: 'Could not find your client',
		});
		return;
	}

	let isAuthenticated = token && (await auth.validateUser(token, client));

	let game = ServerGame.getGame(gameID);
	if (!game) {
		res.json({
			success: false,
			alert: false,
			message: 'This is not a valid game',
		});
		return;
	} else if (game.clientManager.clients.find((testClient: ServerClient) => testClient.getID() === client.getID())) {
		res.json({
			success: false,
			alert: true,
			message: 'You are already in this game',
		});
		return;
	} else if (game.clientManager.clients.length >= game.clientManager.maxPlayers) {
		res.json({
			success: false,
			alert: true,
			message: 'This game is already full',
		});
		return;
	}

	await game.clientManager.connectClient(client);
}

export function register(req: Request, res: Response) {
	//TODO: Implement name restrictions

	const username = req.query.username!.toString();
	const password = req.query.password!.toString();

	if (!username || !password) {
		res.json({
			success: false,
			result: 'Invalid username or password',
		});
		return;
	}

	auth.createAccount(username, password)
		.then(async (result: RegistrationResponseData) => {
			res.json({
				success: result.id === 0x00,
				result: result.id,
				token: result.id === 0x00 ? await auth.generateToken(username) : null,
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
}

export function login(req: Request, res: Response) {
	//TODO: Implement rate limits and captcha?

	const username = req.query.username!.toString();
	const password = req.query.password!.toString();

	if (!username || !password) {
		res.json({
			success: false,
			result: 'Invalid username or password',
		});
		return;
	}

	auth.attemptLogin(username, password)
		.then(async (result: boolean) => {
			res.json({
				success: result,
				token: result ? await auth.generateToken(username) : null,
			});
		})
		.catch((error: unknown) => {
			console.error('Error logging in:');
			console.error(error);
			res.json({
				success: false,
			});
		});
}

export async function logout(req: Request, res: Response) {
	console.error('Logging out:', req.headers.authorization!.split(' ')[1]);

	const token = req.headers.authorization!.split(' ')[1];
	let valid = token && (await auth.validateUser(token, null));

	if (valid)
		auth.logout(token)
			.then(async (result: boolean) => {
				res.json({
					success: result,
				});
			})
			.catch((error: unknown) => {
				console.error('Error logging out:');
				console.error(error);
				res.json({
					success: false,
				});
			});
	else
		res.json({
			success: false,
		});
}

export async function account(req: Request, res: Response) {
	const token = req.headers.authorization!.split(' ')[1];
	let valid = token && (await auth.validateUser(token, null));

	if (valid)
		auth.getAccountInfo(token)
			.then(async (result: object) => {
				res.json({
					success: true,
					info: result,
				});
			})
			.catch((error: unknown) => {
				console.error('Error fetching account info:');
				console.error(error);
				res.json({
					success: false,
				});
			});
	else
		res.json({
			success: false,
		});
}

export async function changeusername(req: Request, res: Response) {
	const token = req.headers.authorization!.split(' ')[1];
	let username = req.query.username;
	if (!username) return;
	username = username.toString();

	let valid = token && username && (await auth.validateUser(token, null));

	if (valid)
		auth.changeUsername(token, username)
			.then(async (result: NameChangeResponseData) => {
				res.json({
					result: result.id,
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing username');
				console.error(error);
				res.json({
					result: NameChangeResponse.ERROR.id,
				});
			});
	else
		res.json({
			result: NameChangeResponse.ERROR.id,
		});
}

export async function changeemail(req: Request, res: Response) {
	const token = req.headers.authorization!.split(' ')[1];
	let email = req.query.email;
	if (!email) return;
	email = email.toString();

	let valid = token && email && (await auth.validateUser(token, null));

	if (valid)
		auth.changeEmail(token, email)
			.then(async (result: EmailChangeResponseData) => {
				res.json({
					result: result.id,
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				res.json({
					result: EmailChangeResponse.ERROR.id,
				});
			});
	else
		res.json({
			result: EmailChangeResponse.ERROR.id,
		});
}

export async function changepassword(req: Request, res: Response) {
	const token = req.headers.authorization!.split(' ')[1];

	if (!req.query.oldPassword || !req.query.newPassword) return;
	let oldPassword = req.query.oldPassword.toString();
	let newPassword = req.query.newPassword.toString();

	let valid = token && oldPassword && newPassword && (await auth.validateUser(token, null));

	if (valid)
		auth.changePassword(token, oldPassword, newPassword)
			.then(async (result: PasswordChangeResponseData) => {
				res.json({
					result: result.id,
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				res.json({
					result: PasswordChangeResponse.ERROR.id,
				});
			});
	else
		res.json({
			result: PasswordChangeResponse.ERROR.id,
		});
}

export async function resetpassword(req: Request, res: Response) {
	const token = req.query.token!.toString();
	const password = req.query.password!.toString();

	let valid = token && password && (await auth.validateUser(token));
	if (valid)
		auth.changePassword(token, null, password, false)
			.then(async (result: PasswordChangeResponseData) => {
				res.json({
					result: result.id,
				});
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				res.json({
					result: PasswordChangeResponse.ERROR.id,
				});
			});
	else
		res.json({
			result: PasswordChangeResponse.ERROR.id,
		});
}

export async function forgotpassword(req: Request, res: Response) {
	const email = req.query.email!.toString();
	await auth.requestPasswordReset(email);

	res.json({
		success: true,
	});
}

export async function forgotusername(req: Request, res: Response) {
	const email = req.query.email!.toString();
	await auth.requestUsername(email);

	res.json({
		success: true,
	});
}

export async function resendverification(req: Request, res: Response) {
	const token = req.headers.authorization!.split(' ')[1];
	let valid = token && (await auth.validateUser(token, null));

	if (valid) {
		await auth.sendEmailVerification(token);
		res.json({
			success: true,
		});
	} else {
		res.json({
			success: false,
		});
	}
}

export async function verify(req: Request, res: Response) {
	const token = req.query.token!.toString();
	let valid = token && (await auth.validateUser(token, null));

	if (valid) {
		await auth
			.verifyEmail(token)
			.then(async (result: boolean) => {
				res.redirect(
					'/account?toast=' +
						(result ? ToastMessage.EMAIL_VERIFIED.id : ToastMessage.EMAIL_VERIFIED_ERROR.id),
				);
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
