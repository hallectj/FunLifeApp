const express = require('express');
const router = express.Router();
const pool = require('../pool')

// Route for fetching all presidents
router.get('/', (req, res) => {
  pool.query('SELECT * FROM public."NumberOneHits"', (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.rows);
    }
  });
});

module.exports = router;