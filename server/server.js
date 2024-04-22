const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const chalk = require('chalk');

const port = 3000;
let viewsDir = `${__dirname}/../client/views`;

app.set('view engine', 'ejs');
app.set('views', viewsDir);

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.get('/:pageName', (req, res) => {
	console.log(`request incoming: ${Date.now()}, ${req.path}`);

	let pageName = req.params.pageName;
	let pagePath = `${__dirname}/../client/views/pages/${pageName}.ejs`;

	if (fs.existsSync(`${viewsDir}/${pageName}.ejs`)) {
		res.render(pagePath);
	} else {
		res.status(404).render('404');
	}
});

app.listen(port, () => {
	let envColor = process.env.NODE_ENV === 'production' ? chalk.green : chalk.blue;
	console.log(`Listening on port ${chalk.red(port)} in ${envColor(process.env.NODE_ENV)} mode`);
});


