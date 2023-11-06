const express = require('express');
const router = express.Router();
const pool = require('../pool')

// Route for fetching all presidents
router.get('/', (req, res) => {
  pool.query('SELECT * FROM public."Presidents"', (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.rows);
    }
  });
});

// Route for fetching a single president by ID
router.get('/:presId', (req, res) => {
  const presId = req.params.presId;

  const query = {
    text: 'SELECT * FROM public."Presidents" WHERE number = $1',
    values: [presId],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.rows.length === 0) {
        res.status(404).send('President not found');
      } else {
        res.json(result.rows[0]);
      }
    }
  });
});

module.exports = router;