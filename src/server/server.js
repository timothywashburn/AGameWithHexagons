const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const endpoints = require('./api-endpoints.js');
const webpackConfig = require('../../webpack.dev.js');

const port = 3000;
const viewsDir = `${__dirname}/../client/views`;
const isDev = process.env.NODE_ENV === 'development';

app.set('view engine', 'ejs');
app.set('views', viewsDir);

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

const defaultConfig = require('./config.defaults.json');

let localConfig = {};
try {
	localConfig = require('./config.local.json');
} catch(err) {
	if(err.code !== 'MODULE_NOT_FOUND') {
		throw err;
	}
}

const config = { ...defaultConfig, ...localConfig };
console.log('E CONFIG: ' + config);
const { init } = require('./authentication');

module.exports = { io, config };

init(config);
