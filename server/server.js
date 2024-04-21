const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;
let viewsDir = __dirname + '/../client/views';

app.set('view engine', 'ejs');
app.set('views', viewsDir);

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/:pageName', (req, res) => {
	console.log(`request incoming: ${Date.now()}, ${req.path}`);

	let pageName = req.params.pageName;
	let pagePath = path.join(__dirname, '../client', 'views', `${pageName}.ejs`);

	if (fs.existsSync(`${viewsDir}/${pageName}.ejs`)) {
		res.render(pagePath);
	} else {
		res.status(404).render('404');
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port} in ${process.env.NODE_ENV} mode`);
});


