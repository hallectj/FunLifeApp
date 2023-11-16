const express = require('express');
const router = express.Router();
const fetch = require("node-fetch-commonjs");

router.get('/song/:songName', async (req, res) => {
  //const { song } = req.query;
  const song = req.params.songName.replace(/-/g, ' '); // Replace hyphens with spaces

  if (!song) {
    return res.status(400).json({ error: 'The song parameter is required.' });
  }

  const url = 'https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/all.json';

  try {
    const response = await fetch(url);
    const data = await response.json();

    const matchingSongs = routeBody(song, data);

    if (matchingSongs.length > 0) {
      res.json(matchingSongs);
    } else {
      res.status(404).json({ error: 'Song not found.' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve information about a song
router.get('/song/:songName/:artist', async (req, res) => {
  const song = req.params.songName.replace(/-/g, ' '); // Replace hyphens with spaces
  const artist = req.params.artist.replace(/-/g, ' '); // Replace hyphens with spaces

  if (!song && !artist) {
    return res.status(400).json({ error: 'The song and artist parameter is required.' });
  }

  const url = 'https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/all.json';

  try {
    const response = await fetch(url);
    const data = await response.json();

    const matchingSongs = routeBody(song, data);

    const songObjIdx = matchingSongs.findIndex(v => v.artist === artist);
    const songObj = (songObjIdx !== -1) ? matchingSongs[songObjIdx] : null;

    if (matchingSongs.length > 0 && songObjIdx !== -1) {
      res.json(songObj);
    } else {
      res.status(206).json({ error: 'Song with artist not found.' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve information about songs
router.post('/songs', async (req, res) => {
  // Get the songs and artists from the request body
  const { pairs } = req.body;

  if (!pairs || !Array.isArray(pairs)) {
    return res.status(400).json({ error: 'Please provide a valid list of song-artist pairs in the request body.' });
  }

  const url = 'https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/all.json';

  try {
    const response = await fetch(url);
    const data = await response.json();

    const songObjects = [];

    for (const pair of pairs) {
      const song = pair.song.replace(/-/g, ' ');
      const artist = pair.artist.replace(/-/g, ' ');

      const matchingSongs = routeBody(song, data);

      const songObjIdx = matchingSongs.findIndex((v) => v.artist === artist);
      const songObj = songObjIdx !== -1 ? matchingSongs[songObjIdx] : null;

      if (matchingSongs.length > 0 && songObjIdx !== -1) {
        songObjects.push(songObj);
      }
    }

    if (songObjects.length > 0) {
      res.json(songObjects);
    } else {
      res.status(404).json({ error: 'No matching songs found for the provided list.' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function routeBody(song, data){
  // Create a map to track the lowest "peak_position" for each artist
  const artistPeakMap = new Map();

  // Create a map to track the highest "weeks_on_chart" for each artist
  const artistWeeksMap = new Map();
  
  // Manually iterate through the data to find the matching songs
  for (const entry of data) {
    for (const songEntry of entry.data) {
      if (songEntry.song.toLowerCase() === song.toLowerCase()) {
        const artist = songEntry.artist;
  
        // Track lowest peak_position
        if (!artistPeakMap.has(artist) || songEntry.peak_position < artistPeakMap.get(artist).peak_position) {
          artistPeakMap.set(artist, {
           peak_position: songEntry.peak_position,
           highest_peak_date: entry.date,
           song: songEntry.song
          });
        }
  
        // Track highest weeks_on_chart
        if (!artistWeeksMap.has(artist) || songEntry.weeks_on_chart > artistWeeksMap.get(artist).weeks_on_chart) {
          artistWeeksMap.set(artist, {
           weeks_on_chart: songEntry.weeks_on_chart,
           song: songEntry.song
          });
        }
      }
    }
  }

  const matchingSongs = [...artistPeakMap.keys()].map((artist) => ({
    artist,
    song: artistWeeksMap.get(artist).song,
    highest_peak_date: artistPeakMap.get(artist).highest_peak_date,
    peak_position: artistPeakMap.get(artist).peak_position,
    weeks_on_chart: artistWeeksMap.get(artist).weeks_on_chart,
  }));

  return matchingSongs;
}

module.exports = router;