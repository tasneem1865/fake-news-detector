const express = require('express');
const router = express.Router();
const Article = require('../models/NewsArticle');

// 1. Analyze endpoint — for immediate prediction only (no auth, not saved)
router.post('/analyze', (req, res) => {
  const { title, content } = req.body;
  // Simulate detection logic (replace with your ML logic as needed)
  if ((content && content.toLowerCase().includes('alien')) || (title && title.toLowerCase().includes('alien'))) {
    return res.json({ status: 'fake' });
  }
  // For demo/placeholder: Random
  const fakeProbability = Math.random();
  const status = fakeProbability > 0.5 ? 'fake' : 'real';
  res.json({ status });
});

// 2. Save news article (auth required, example placeholder for req.user)
router.post('/', async (req, res) => {
  try {
    const { title, content, source } = req.body;
    // Placeholder: set user as 'testuserid' if req.user is not present
    const userId = req.user?._id || 'testuserid';
    const fakeProbability = Math.random();
    const status = fakeProbability > 0.5 ? 'fake' : 'real';
    const article = new Article({ title, content, source, status, user: userId });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Get all news articles for user
router.get('/', async (req, res) => {
  try {
    // Placeholder: set user as 'testuserid' if req.user is not present
    const userId = req.user?._id || 'testuserid';
    const articles = await Article.find({ user: userId }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Get a news article by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user?._id || 'testuserid';
    const article = await Article.findOne({ _id: req.params.id, user: userId });
    if (!article) return res.status(404).json({ message: 'News article not found' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Update a news article by ID
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?._id || 'testuserid';
    const updated = await Article.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'News article not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. Delete a news article by ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?._id || 'testuserid';
    const deleted = await Article.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'News article not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
