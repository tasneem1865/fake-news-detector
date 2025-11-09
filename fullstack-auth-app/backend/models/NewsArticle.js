// backend/models/NewsArticle.js
const mongoose = require('mongoose');

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  source: { type: String },
  url: { type: String }, // ← add this line
  status: { type: String, enum: ['fake', 'real'], default: 'real' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

module.exports = mongoose.model('NewsArticle', NewsArticleSchema);
