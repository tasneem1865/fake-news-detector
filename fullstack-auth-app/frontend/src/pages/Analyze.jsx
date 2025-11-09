import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Analyze() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    source: '',
    url: ''
  })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
    setStatus('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setStatus('')
    try {
      // Replace '/news/analyze' with your backend endpoint for prediction/submission
      const res = await api.post('/news/analyze', form)
      setStatus(res.data.status) // Assuming backend returns {status: 'fake'|'real'}
      setSuccess('Analysis complete. See result below.')
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing news')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
      <h2>Analyze News</h2>
      <div className="card-app" style={{ textAlign: 'center' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Title</label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="Article title" required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Content</label>
            <textarea className="form-control" name="content" value={form.content} onChange={handleChange} placeholder="Paste news content here" required rows={5} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Source</label>
            <input className="form-control" name="source" value={form.source} onChange={handleChange} placeholder="Publisher name" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">URL (optional)</label>
            <input className="form-control" name="url" value={form.url} onChange={handleChange} placeholder="Source article URL" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze News'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 18 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 18 }}>{success}</div>}
        {status && (
          <div style={{ marginTop: 24 }}>
            <div>
              <span className={`badge ${status === 'real' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                {status === 'real' ? 'Article is likely Real News' : 'Article is likely Fake News'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
