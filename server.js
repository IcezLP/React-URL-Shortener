const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const apiController = require('./controllers/apiController');

// Access .env file values
require('dotenv').config();
const { MONGODB_URL, PORT, BASE_URL } = process.env;

const server = express();

// BodyParser middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(MONGODB_URL, { useNewUrlParser: true }, err => {
  if (err) console.log(err);
  else console.log('Database ready');
});

// Redirect any route which includes /api to apiRoute controller
server.use('/', apiController);

// Render compiled react in production
if (process.env.NODE_ENV === 'production') {
  server.use(express.static('client/build'));

  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
server.listen(PORT, () => console.log(`Server ready on ${BASE_URL}`));
