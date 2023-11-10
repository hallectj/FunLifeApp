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

// Route for fetching all hot 100 songs by a given year
router.get('/:year', (req, res) => {
  const year = req.params.year;

  const query = {
    text: 'SELECT * FROM public."TopSongs" WHERE year = $1 ORDER BY position',
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