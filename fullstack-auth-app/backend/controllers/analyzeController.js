const NewsArticle = require('../models/NewsArticle');

exports.createNewsArticle = async (req, res) => {
  try {
    const { title, content, source } = req.body;
    // Simulate fake news detection logic or integrate real detection here
    const fakeProbability = Math.random();
    const status = fakeProbability > 0.5 ? 'fake' : 'real';

    const newsArticle = new NewsArticle({ 
      title, 
      content, 
      source, 
      status,
      user: req.user 
    });
    await newsArticle.save();
    res.status(201).json(newsArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNewsArticles = async (req, res) => {
  try {
    const newsArticles = await NewsArticle.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(newsArticles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNewsArticle = async (req, res) => {
  try {
    const newsArticle = await NewsArticle.findOne({ _id: req.params.id, user: req.user });
    if (!newsArticle) return res.status(404).json({ message: 'News article not found' });
    res.json(newsArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNewsArticle = async (req, res) => {
  try {
    const updated = await NewsArticle.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'News article not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNewsArticle = async (req, res) => {
  try {
    const deleted = await NewsArticle.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!deleted) return res.status(404).json({ message: 'News article not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
