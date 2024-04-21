const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/:pageName', (req, res) => {
  console.log(`request incoming: ${Date.now()}, ${req.path}`);

  let pageName = req.params.pageName;
  let pagePath = path.join(__dirname, '../client', 'pages', `${pageName}.html`);
  if (fs.existsSync(pagePath)) {
    res.sendFile(pagePath);
  } else {
    res.status(404).send('404 Not Found');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


