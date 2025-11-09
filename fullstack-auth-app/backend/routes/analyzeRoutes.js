const express = require('express');
const router = express.Router();
const NewsArticle = require('../models/NewsArticle'); // Updated to use NewsArticle

// POST /api/analyze/analyze
router.post('/analyze', async (req, res) => {
  const { title, content, source } = req.body;

  // 1. Analyze logic
  let status = 'real';
  if ((content && content.toLowerCase().includes('alien')) ||
      (title && title.toLowerCase().includes('alien'))) {
    status = 'fake';
  } else {
    status = Math.random() > 0.5 ? 'fake' : 'real';
  }

  try {
    // 2. Save analyzed article to DB
    const userId = req.user?._id || 'publicuser'; // Adjust as appropriate
    const newNewsArticle = new NewsArticle({
      title,
      content,
      source,
      status,
      user: userId,
    });
    await newNewsArticle.save();

    // 3. Respond with analysis and saved article info
    res.json({
      status,
      saved: true,
      article: newNewsArticle,
    });
  } catch (err) {
    console.error('Error saving analyzed article:', err);
    res.status(500).json({ message: 'Error saving analyzed article' });
  }
});

module.exports = router;
