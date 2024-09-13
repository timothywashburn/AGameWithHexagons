import { Server, Socket } from 'socket.io';
import * as http from 'http';

import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { handleEndpoint } from './api/endpoint';
import webpackConfig from '../../webpack.dev';
import * as sql from './controllers/sql';
import config from '../../config.json';
import { isDev } from './misc/utils';
import ServerClient from './objects/server-client';
import ServerGame from './objects/server-game';
import { getUserProfile, validateUser, verifyToken } from './controllers/authentication';

const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(prepareRendering);

const viewsDir = `${__dirname}/../client/views`;

app.set('view engine', 'ejs');
app.set('views', viewsDir);

const validateConfig = () => {
	const configPath = path.join(__dirname, '../../config.json');
	const exampleConfigPath = path.join(__dirname, '../../config.example.json');
	if (!fs.existsSync(configPath)) {
		console.error(
			'config.json not found. Please copy config.example.json to config.json and fill in the required values'
		);
		process.exit(1);
	}

	const config = require(configPath);
	const exampleConfig = require(exampleConfigPath);

	// Function to check for missing keys, including nested keys
	const checkMissingKeys = (example: any, actual: any, prefix = '') => {
		Object.keys(example).forEach((key) => {
			const fullKey = prefix ? `${prefix}.${key}` : key;
			if (typeof example[key] === 'object' && !Array.isArray(example[key])) {
				if (!actual[key] || typeof actual[key] !== 'object') {
					console.error(`config.json is missing the key: ${fullKey}. please reference config.example.json`);
					process.exit(1);
				}
				checkMissingKeys(example[key], actual[key], fullKey);
			} else if (!actual.hasOwnProperty(key)) {
				console.error(`config.json is missing the key: ${fullKey}. please reference config.example.json`);
				process.exit(1);
			}
		});
	};
	checkMissingKeys(exampleConfig, config);
};
validateConfig();

if (isDev) {
	const compiler = webpack(webpackConfig);
	app.use(
		webpackDevMiddleware(compiler, {
			headers: (req: Request, res: Response) => {
				res.set('Cache-Control', 'no-store');
			}
		})
	);
} else {
	app.use(
		express.static('dist', {
			setHeaders: (res: Response) => {
				// TODO: Switch to a content hashing cache system before removing this
				res.set('Cache-Control', 'no-store');
			}
		})
	);
}

//Let me know if there is a better way to go about this
app.get('/account', ensureAuthenticated, (req, res) => {
	res.render('pages/account');
});

app.get('/login', ensureAuthenticated, (req, res) => {
	res.render('pages/login');
});

app.get('/register', ensureAuthenticated, (req, res) => {
	res.render('pages/register');
});

app.get('/', (req: Request, res: Response) => {
	res.render('pages/index');
});

app.get('/api/:endpoint', async (req: Request, res: Response) => {
	let endpoint = req.params.endpoint.toLowerCase();

	await handleEndpoint(req, res);
});

app.use('/images', express.static(path.join(__dirname, '../client/images')));

app.get('/:page', (req: Request, res: Response) => {
	console.log(`request incoming: ${Date.now()}, ${req.path}`);

	let pageName = req.params.page;
	let pagePath = `${viewsDir}/pages/${pageName}.ejs`;
	if (fs.existsSync(pagePath)) {
		res.render(pagePath);
	} else {
		res.status(404).render('pages/404');
	}
});

let game = new ServerGame();
let game2 = new ServerGame();

const server = http.createServer(app);
export const serverSocket = new Server(server);

serverSocket.on('connection', (socket: Socket) => {
	new ServerClient(socket);
});

server.listen(config.port, () => {
	let envColor = isDev ? chalk.blue : chalk.green;
	console.log(`Listening on port ${chalk.red(config.port)} in ${envColor(process.env.NODE_ENV)} mode`);
});

sql.init();

export async function prepareRendering(req: Request, res: Response, next: NextFunction) {
	const svgPath = path.join(__dirname, '../client', 'images', 'account.svg');
	fs.readFile(svgPath, 'utf8', (err, svgContent) => {
		if (err) {
			console.error('Error reading SVG file:', err);
			return res.status(500).send('Internal Server Error');
		}

		res.locals.profileImg = svgContent;

		if (!req.cookies || !req.cookies.token) {
			next();
			return;
		}

		const token = req.cookies.token;

		getUserProfile(token)
			.then((user) => {
				res.locals.user = user;
				next();
			})
			.catch((error) => {
				console.warn('Account not found or token is expired!');
				next();
			});
	});
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.token;
	let verified = await validateUser(token);

	if (!verified) {
		if (req.path === '/account') {
			return res.redirect('/login');
		}
		return next();
	} else {
		if (req.path === '/login' || req.path === '/register') {
			return res.redirect('/account');
		}
		return next();
	}
}
