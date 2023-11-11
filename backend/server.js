const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${port}`;
const pool = require('./pool');
const presidentsRouter = require('./routes/presidents');
const topSongsRouter = require('./routes/top_songs');
const artistRouter = require('./routes/artist');
const songInfoRouter = require('./routes/song_info');
const celebrityRouter = require('./routes/celebrities');
const fetch = require("node-fetch-commonjs")

app.use(cors());

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.use('/presidents', presidentsRouter);
app.use('/top-songs', topSongsRouter);
app.use('/artist', artistRouter);
app.use('/song-info', songInfoRouter);
app.use('/celebrities', celebrityRouter);

app.listen(port, () => {
  console.log(BASE_URL);
});

app.get('/', (req, res) => {
  res.json({ message: 'This is your Node.js server response.' });
});