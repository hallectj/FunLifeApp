const express = require('express');
const router = express.Router();
const pool = require('../pool')

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
      res.json(result.rows);
    }
  });
});

// Route for fetching a celebrity by name
router.get('/celeb/:name', (req, res) => {
  const name = req.params.name;

  const query = {
    text: 'SELECT * FROM public."Celebrities" WHERE name = $1',
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

module.exports = router;