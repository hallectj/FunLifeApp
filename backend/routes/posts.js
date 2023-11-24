const express = require('express');
const router = express.Router();
const fetch = require("node-fetch-commonjs");
const pool = require('../pool');

router.get('/', (req, res) => {
  pool.query('SELECT * FROM public."Articles"', (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.rows);
    }
  });
});

// Route to get JSON data
router.get('/json/:postId', async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({ error: 'The postId is required.' });
  }

  try {
    // Fetch the URL and other data from the database based on the postId
    const query = 'SELECT * FROM public."Articles" WHERE "postId" = $1';
    const result = await pool.query(query, [postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const postData = result.rows[0];

    // Send JSON response with additional data
    res.json({
      postData
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get HTML content
router.get('/html/:postId', async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({ error: 'The postId is required.' });
  }

  try {
    // Fetch the URL from the database based on the postId
    const query = 'SELECT pointer FROM public."Articles" WHERE "postId" = $1';
    const result = await pool.query(query, [postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const url = result.rows[0].pointer;

    // Fetch HTML data from the external URL
    const response = await fetch(url);

    if (response.ok) {
      const htmlContent = await response.text();
      
      // Send HTML response
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch post data.' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
