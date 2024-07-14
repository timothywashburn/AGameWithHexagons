import {Socket} from "socket.io";

const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const endpoints = require('./api/api-endpoints');
const webpackConfig = require('../../webpack.dev');
const authentication = require('./authentication');
const config = require('../../config.json');
const { isDev } = require('./misc/utils');

const viewsDir = `${__dirname}/../client/views`;

import { Request, Response } from 'express';
import Client from './objects/client';
import ServerGame from './objects/server-game';

app.set('view engine', 'ejs');
app.set('views', viewsDir);

const validateConfig = () => {
	const configPath = path.join(__dirname, '../../config.json');
	const exampleConfigPath = path.join(__dirname, '../../config.example.json');
	if (!fs.existsSync(configPath)) {
		console.error('config.json not found. Please copy config.example.json to config.json and fill in the required values');
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
	}
	checkMissingKeys(exampleConfig, config);
}
validateConfig();

if (isDev) {
	const compiler = webpack(webpackConfig);
	app.use(
		webpackDevMiddleware(compiler, {
			headers: (req: Request, res: Response) => {
				res.set('Cache-Control', 'no-store');
			},
		}),
	);
} else {
	app.use(
		express.static('dist', {
			setHeaders: (res: Response) => {
				// TODO: Switch to a content hashing cache system before removing this
				res.set('Cache-Control', 'no-store');
			},
		}),
	);
}

app.get('/', (req: Request, res: Response) => {
	res.render('pages/index');
});

app.get('/api/:endpoint', (req: Request, res: Response) => {
	let endpoint = req.params.endpoint.toLowerCase();

	if (typeof endpoints[endpoint] === 'function') {
		endpoints[endpoint](req, res);
	} else {
		res.status(404).json({
			success: false,
			error: 'Endpoint not found',
		});
	}
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

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

let game = new ServerGame(server, 5);
let game2 = new ServerGame(server, 5);

const serverSocket = new Server(server);

serverSocket.on('connection', (socket: Socket) => {
	new Client(socket);
});

server.listen(config.port, () => {
	let envColor = isDev ? chalk.blue : chalk.green;
	console.log(`Listening on port ${chalk.red(config.port)} in ${envColor(process.env.NODE_ENV)} mode`);
});

Object.assign(module.exports, {
	io: serverSocket
});

authentication.init();
