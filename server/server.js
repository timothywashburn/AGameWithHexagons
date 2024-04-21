const path = require('path');
const express = require('express');
const {response} = require("express");
const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, '../client')));

app.use((req, res) => {
  console.log('request incoming');
  console.log(req.path);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


