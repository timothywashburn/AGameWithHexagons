const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const endpoints = require('./api-endpoints');
const webpackConfig = require('../../webpack.dev');
const authentication = require('./authentication');

const port = 3000;
const viewsDir = `${__dirname}/../client/views`;
const isDev = process.env.NODE_ENV === 'development';

app.set('view engine', 'ejs');
app.set('views', viewsDir);

const validateConfig = () => {
	const configPath = path.join(__dirname, 'config.json');
	const exampleConfigPath = path.join(__dirname, 'config.example.json');
	if (!fs.existsSync(configPath)) {
		console.error('config.json not found. Please copy config.example.json to config.json and fill in the required values');
		process.exit(1);
	}

	const config = require(configPath);
	const exampleConfig = require(exampleConfigPath);

// Function to check for missing keys, including nested keys
	const checkMissingKeys = (example, actual, prefix = '') => {
		Object.keys(example).forEach((key) => {
			const fullKey = prefix ? `${prefix}.${key}` : key;
			if (typeof example[key] === 'object' && !Array.isArray(example[key])) {
				if (!actual[key] || typeof actual[key] !== 'object') {
					console.error(`config.json is missing the key: ${fullKey}`);
					process.exit(1);
				}
				checkMissingKeys(example[key], actual[key], fullKey);
			} else if (!actual.hasOwnProperty(key)) {
				console.error(`config.json is missing the key: ${fullKey}`);
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
			headers: (req, res) => {
				res.set('Cache-Control', 'no-store');
			},
		}),
	);
} else {
	app.use(
		express.static('dist', {
			setHeaders: (res) => {
				// TODO: Switch to a content hashing cache system before removing this
				res.set('Cache-Control', 'no-store');
			},
		}),
	);
}

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.get('/api/:endpoint', (req, res) => {
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

app.get('/:page', (req, res) => {
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
const { GameLobby } = require('./game-lobby');
const { globalClients, Client } = require('./client');

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
	globalClients.push(new Client(socket));

	console.log('a user connected');
});

const gameLobby = new GameLobby(io);

server.listen(port, () => {
	let envColor = isDev ? chalk.blue : chalk.green;
	console.log(`Listening on port ${chalk.red(port)} in ${envColor(process.env.NODE_ENV)} mode`);
});

Object.assign(module.exports, {
	io
});

authentication.init();
