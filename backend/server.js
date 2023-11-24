const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config()
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${port}`;
const pool = require('./pool');
const presidentsRouter = require('./routes/presidents');
const topSongsRouter = require('./routes/top_songs');
const artistRouter = require('./routes/artist');
const songInfoRouter = require('./routes/song_info');
const celebrityRouter = require('./routes/celebrities');
const numberOneHitsRouter = require('./routes/number_one_songs');
const postRouter = require('./routes/posts');
const fetch = require("node-fetch-commonjs")

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//app.use('/images', express.static('path/to/your/image/directory'));

app.use(helmet.contentSecurityPolicy({
  directives: {
    frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.googleapis.com'],
  },
}));

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
app.use('/number-one-hits', numberOneHitsRouter);
app.use('/posts', postRouter);

app.listen(port, () => {
  console.log(BASE_URL);
});

app.get('/', (req, res) => {
  res.json({ message: 'This is your Node.js server response.' });
});