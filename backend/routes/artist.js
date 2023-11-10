const express = require('express');
const router = express.Router();
const unidecode = require('unidecode');
const pool = require('../pool')

// Route for fetching all hot songs by a given artist
router.get('/:artist', (req, res) => {
  const artist = req.params.artist;

  const query = {
    text: 'SELECT * FROM public."TopSongs" WHERE artist ILIKE $1 ORDER BY position',
    values: [`%${artist}%`],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const songs = result.rows;
      res.json(songs);
    }
  });
});

module.exports = router;