export const predict = async (req, res) => {
  try {
    const { text } = req.body || {}
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'Provide text in request body' })
    }
    const t = text.toLowerCase()
    let score = 0
    const suspicious = ['click here', 'shocking', 'you won', 'unbelievable', 'miracle', 'buy now', "don't miss"]
    suspicious.forEach(s => { if (t.includes(s)) score += 2 })
    const exclam = (text.match(/!/g) || []).length
    if (exclam > 2) score += 1
    const label = score >= 4 ? 'fake' : (score >= 2 ? 'needs_review' : 'reliable')
    const conf = Math.min(0.99, Math.max(0.1, score / 6))
    return res.json({ text, label, score, confidence: conf })
  } catch (err) {
    console.error('predict error', err)
    return res.status(500).json({ message: 'Prediction error' })
  }
}
