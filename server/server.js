const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const chalk = require('chalk');

const endpoints = require('./api-endpoints');

const port = 3000;
const viewsDir = `${__dirname}/../client/views`;
const isDev = process.env.NODE_ENV === 'development';

app.set('view engine', 'ejs');
app.set('views', viewsDir);

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.get('/api/:endpoint', (req, res) => {
	let endpoint = req.params.endpoint;

	if (typeof endpoints[endpoint] === 'function') {
		endpoints[endpoint](req, res);
	} else {
		res.status(404).json({
			success: false,
			error: "Endpoint not found"
		});
	}
});

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

if(isDev) {
	app.use('/client/public', (req, res, next) => {
		res.set('Cache-Control', 'no-store');
		next();
	});
}

app.use('/client/public', express.static(`${__dirname}/../client/public`));

const http = require('http');
const { Server } = require('socket.io');
const GameLobby = require('./game-lobby');

const server = http.createServer(app);
const io = new Server(server);

const gameLobby = new GameLobby(io);

server.listen(port, () => {
	let envColor = isDev ? chalk.blue : chalk.green;
	console.log(`Listening on port ${chalk.red(port)} in ${envColor(process.env.NODE_ENV)} mode`);
});
