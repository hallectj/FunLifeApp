const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config()
const helmet = require('helmet');
const app = express();
const pool = require('./pool');
//const { router: videoKeyRoute } = require('./routes/video_encode_key');
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
if (process.env.NODE_ENV === "development") {
  app.use(cors());
} else if (process.env.NODE_ENV === "production") {
  const allowedOrigins = [process.env.FRONTEND_URL]; // e.g., 'https://your-app.com'
  const dynamicOriginPattern = /^https:\/\/fun-life-[a-z0-9]{8}-hallectjs-projects\.vercel\.app$/;

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (common for server-side fetches like SSR)
      // OR match allowed origins/dynamic pattern
      if (!origin || allowedOrigins.includes(origin) || dynamicOriginPattern.test(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS rejected for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['X-Order-By', 'User-Agent', 'Content-Type'], // Explicitly allow SSR headers
  }));
}

app.options('*', cors(), (req, res) => {
  res.sendStatus(200);
});

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
//app.use('/api/key', videoKeyRoute);

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