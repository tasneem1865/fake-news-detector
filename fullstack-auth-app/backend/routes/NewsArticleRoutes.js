const express = require('express');
const router = express.Router();
const NewsArticle = require('../models/NewsArticle');

// Aggregation route for dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const statusCounts = await NewsArticle.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const uniqueSources = await NewsArticle.distinct('source');

    const stats = { total: 0, fake: 0, real: 0, sources: uniqueSources.length };
    statusCounts.forEach(({ _id, count }) => {
      if (_id === 'fake') stats.fake = count;
      else if (_id === 'real') stats.real = count;
      stats.total += count;
    });

    res.json(stats);
  } catch (err) {
    console.error('Aggregation error:', err);
    res.status(500).json({ message: 'Server error while aggregating stats' });
  }
});

// Analyze news route - analyzes and saves to DB (realistic rule-based)
// Accepts title, content, source (publisher), and url
router.post('/analyze', async (req, res) => {
  const { title, content, source, url } = req.body;
  let status = 'real';
  // Keyword-based fake detection
  const fakeIndicators = [
    "alien", "lottery winner", "miracle cure", "click here", "secret government", "flat earth",
    "shocking", "celebrity scandal", "100% accurate", "you won't believe", "moon landing hoax"
  ];
  const combined = ((title || "") + " " + (content || "")).toLowerCase();
  for (const keyword of fakeIndicators) {
    if (combined.includes(keyword)) {
      status = 'fake';
      break;
    }
  }
  try {
    const fields = { title, content, source, url, status };
    if (req.user && req.user._id) fields.user = req.user._id;
    const article = new NewsArticle(fields);
    await article.save();
    res.json({ status, saved: true, article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving analyzed article', error: err });
  }
});

// Create news article
router.post('/', async (req, res) => {
  try {
    const { title, content, source, url, status } = req.body;
    const articleStatus = status || (Math.random() > 0.5 ? 'fake' : 'real');
    const fields = { title, content, source, url, status: articleStatus };
    if (req.user && req.user._id) fields.user = req.user._id;
    const newArticle = new NewsArticle(fields);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all news articles
router.get('/', async (req, res) => {
  try {
    const articles = await NewsArticle.find({}).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a news article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a news article by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await NewsArticle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a news article by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await NewsArticle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publishers/Sources: Distinct publishers and their URLs
router.get('/sources', async (req, res) => {
  try {
    const sources = await NewsArticle.aggregate([
      {
        $group: {
          _id: { source: "$source", url: "$url" }
        }
      }
    ]);
    const sourcesWithInfo = sources
      .filter(s => s._id.source)
      .map(s => ({
        name: s._id.source,
        url: s._id.url || "",
        verified: false
      }));
    res.json(sourcesWithInfo);
  } catch (err) {
    console.error('Error fetching sources:', err);
    res.status(500).json({ message: 'Server error fetching sources' });
  }
});

module.exports = router;
