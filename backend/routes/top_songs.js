const express = require('express');
const router = express.Router();
const pool = require('../pool')

// Route for fetching all hot 100 songs for a particular year
router.get('/', (req, res) => {
  const query = `
    SELECT * FROM public."TopSongs"
    ORDER By year, position
  `
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.rows);
    }
  });
});

router.get('/:year/:position/', async (req, res) => {
  try {
    const year = req.params.year;
    const position = req.params.position;

    // Perform a case-insensitive database query to find the record based on the provided parameters
    const result = await pool.query(
      `SELECT * FROM public."TopSongs" 
       WHERE year = $1 AND position = $2`,
      [year, position]
    );

    // Check if a record was found
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the found record as a JSON response
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:year/:artist/:song', async (req, res) => {
  try {
    const year = req.params.year;
    const position = req.params.position;
    const artist = req.params.artist.replace(/-/g, ' ').toLowerCase();
    const song = req.params.song.replace(/-/g, ' ').toLowerCase();

    // Perform a case-insensitive database query to find the record based on the provided parameters
    const result = await pool.query(
      `SELECT * FROM public."TopSongs" 
       WHERE year = $1 AND LOWER(artist) = $2 
       AND LOWER(song) = $3`,
      [year, artist, song]
    );

    // Check if a record was found
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the found record as a JSON response
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching all hot 100 songs by a given year
router.get('/:year', (req, res) => {
  const year = req.params.year;
  const orderBy = req.get('X-Order-By') || 'position'; // Default to ordering by 'position'

  let orderClause;

  if (orderBy === 'random') {
    orderClause = 'ORDER BY year, random()';
  } else {
    orderClause = 'ORDER BY year, position';
  }

  const query = {
    text: `SELECT * FROM public."TopSongs" WHERE year = $1 ${orderClause}`,
    values: [year],
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