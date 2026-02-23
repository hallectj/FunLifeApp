const express = require('express');
const router = express.Router();
const fetch = require("node-fetch-commonjs");

// Route for fetching historical events from Wikimedia
// Accepts: /events/:category/:month/:day or /events/:month/:day (defaults to events)
router.get('/:month/:day', async (req, res) => {
  try {
    const { month, day } = req.params;
    const category = 'events'; // Default to events category
    
    // Validate inputs
    if (!month || !day) {
      return res.status(400).json({ error: 'Month and day are required' });
    }
    
    const wikiURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/${category}/${month}/${day}`;
    
    const response = await fetch(wikiURL);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Wikimedia API' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching events from Wikimedia:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Alternative route to support custom categories
router.get('/:category/:month/:day', async (req, res) => {
  try {
    const { category, month, day } = req.params;
    
    // Validate inputs
    const validCategories = ['births', 'deaths', 'events', 'holidays', 'selected'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    if (!month || !day) {
      return res.status(400).json({ error: 'Month and day are required' });
    }
    
    const wikiURL = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/${category}/${month}/${day}`;
    
    const response = await fetch(wikiURL);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Wikimedia API' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching events from Wikimedia:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

