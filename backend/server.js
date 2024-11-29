const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config()
const helmet = require('helmet');
const app = express();
const pool = require('./pool');
const presidentsRouter = require('./routes/presidents');
const topSongsRouter = require('./routes/top_songs');
const artistRouter = require('./routes/artist');
const songInfoRouter = require('./routes/song_info');
const celebrityRouter = require('./routes/celebrities');
const numberOneHitsRouter = require('./routes/number_one_songs');
const postRouter = require('./routes/posts');
const sitemapGenerator = require('./routes/generate-sitemap');
const fetch = require("node-fetch-commonjs")
const pgp = require('pg-promise')();
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
if(process.env.NODE_ENV  === "Development"){
  app.use(cors());
}else if(process.env.NODE_ENV  === "Production"){
  const allowedOrigins = [process.env.FRONTEND_URL]; // Use environment variable for your frontend
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no 'origin' (e.g., mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable credentials if needed
  }));
}

app.options('*', cors()); // Allow all OPTIONS requests

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//app.use('/images', express.static('path/to/your/image/directory'));

app.use(helmet.contentSecurityPolicy({
  directives: {
    frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.googleapis.com'],
  },
}));

if(process.env.NODE_ENV === 'development'){
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to database');
    }
  });

   const db = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

   db.one('SELECT pg_size_pretty(pg_database_size($1)) AS database_size', [`${process.env.DB_NAME}`])
   .then(result => {
      console.log('Database Size:', result.database_size);
     })
   .catch(error => {
     console.error('Error:', error);
     })
   .finally(() => {
     // Close the database connection
     pgp.end();
    }
  );
}

app.use('/api/presidents', presidentsRouter);
app.use('/api/top-songs', topSongsRouter);
app.use('/api/artist', artistRouter);
app.use('/api/song-info', songInfoRouter);
app.use('/api/celebrities', celebrityRouter);
app.use('/api/number-one-hits', numberOneHitsRouter);
app.use('/api/posts', postRouter);

let apiURL = '';
if(process.env.NODE_ENV === 'development'){
  apiURL = process.env.LOCAL_API_URL;
}else if(process.env.NODE_ENV === 'production'){
  apiURL = process.env.API_URL;
}

if(process.env.GEN_SITEMAP === 'yes'){
  const allRoutes = sitemapGenerator();
  app.get('/sitemap.xml', async (req, res) => {
    const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8', headless: true });
    root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
  
    allRoutes.forEach(route => {
      const url = root.ele('url');
      url.ele('loc', route.loc);
      url.ele('changefreq', route.changefreq);
      url.ele('priority', route.priority);
    });
  
    res.header('Content-Type', 'application/xml');
    res.send(root.end({ pretty: true }));
  });
}

app.listen(port, async () => {
  if(process.env.NODE_ENV === 'development'){
    console.log(apiURL);
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'This is your Node.js server response.' });
});