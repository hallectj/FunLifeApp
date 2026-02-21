const express = require('express');
const router = express.Router();
const fetch = require("node-fetch-commonjs");

// Cache to store recently fetched lyrics (prevents repeated requests for same song)
const lyricsCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

router.get('/:artist/:song', async (req, res) => {
  try {
    const artist = decodeURIComponent(req.params.artist);
    const song = decodeURIComponent(req.params.song);

    if (!artist || !song) {
      return res.status(400).json({ error: 'Artist and song parameters are required.' });
    }

    // Check cache first
    const cacheKey = `${artist}|${song}`;
    const cachedLyrics = lyricsCache.get(cacheKey);
    
    if (cachedLyrics && Date.now() - cachedLyrics.timestamp < CACHE_DURATION) {
      return res.json({ lyrics: cachedLyrics.lyrics });
    }

    // Fetch from external API
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
    
    const response = await fetch(url, {
      timeout: 5000, // 5 second timeout
      headers: {
        'User-Agent': 'BackThenNow/1.0'
      }
    });

    if (response.status === 404) {
      return res.status(404).json({ error: 'Lyrics not found' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch lyrics from external service' });
    }

    const data = await response.json();

    if (data.lyrics) {
      // Cache the lyrics
      lyricsCache.set(cacheKey, {
        lyrics: data.lyrics,
        timestamp: Date.now()
      });
      
      return res.json({ lyrics: data.lyrics });
    } else {
      return res.status(404).json({ error: 'Lyrics not found' });
    }

  } catch (error) {
    console.error('Error fetching lyrics:', error);
    res.status(500).json({ error: 'Internal server error while fetching lyrics' });
  }
});

module.exports = router;
