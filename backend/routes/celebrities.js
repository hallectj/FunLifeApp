const express = require('express');
const router = express.Router();
const pool = require('../pool')
const Fuse = require('fuse.js'); // Import the fuse.js library

// Route for fetching an array of celebrities names
router.get('/', (req, res) => {
  const query = `SELECT * FROM public."Celebrities" ORDER BY name`;

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const names = result.rows.filter(row => !hasRestrictedOccupation(row.occupations)).map(row => row.name);
      res.json(names);
    }
  });
});

// Route for fetching all celebrities
router.get('/:dateset', (req, res) => {
  const dateset = req.params.dateset

  const query = {
    text: `
      SELECT * FROM public."Celebrities" 
      WHERE dateset = $1
      ORDER BY "followerCount" DESC`,
    values: [dateset],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const filteredRows = result.rows.filter(row => !hasRestrictedOccupation(row.occupations));
      res.json(filteredRows);
    }
  });
});

// Route for fetching a celebrity by name
router.get('/celeb/:name', (req, res) => {
  const name = req.params.name;

  const query = {
    text: 'SELECT * FROM public."Celebrities" WHERE name ILIKE $1',
    values: [name],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.rows.length === 0) {
        res.status(404).send('Celebrity not found');
      } else {
        res.json(result.rows[0]);
      }
    }
  });
});

function hasRestrictedOccupation(occupations) {
  const restrictedOccupations = ['pornographic actor', 'erotic photography model', 'stripper'];
  return occupations.some(occupation => restrictedOccupations.includes(occupation));
}

module.exports = router;