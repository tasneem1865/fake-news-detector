import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

export default function NewsForm() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    source: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get(`/news/${id}`)
        setForm({
          title: res.data.title || '',
          content: res.data.content || '',
          source: res.data.source || ''
        })
        setResult(res.data.status || null)
      } catch (err) { console.error(err) }
    }
    load()
  }, [id])

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      let res
      if (id) {
        res = await api.put(`/news/${id}`, form)
      } else {
        res = await api.post('/news', form)
      }
      setResult(res.data.status)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container container-app">
      <div className="card card-app p-4" style={{ maxWidth: 680, margin: '40px auto' }}>
        <h2 className="mb-4 text-white fw-bold">{id ? 'Edit' : 'Submit'} News Article</h2>
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-12">
            <label className="form-label text-white">Title</label>
            <input
              className="form-control form-control-lg"
              name="title"
              placeholder="Enter article title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label text-white">Source</label>
            <input
              className="form-control form-control-lg"
              name="source"
              placeholder="Enter news source"
              value={form.source}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label className="form-label text-white">Content</label>
            <textarea
              className="form-control form-control-lg"
              name="content"
              placeholder="Paste news article content here"
              value={form.content}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>
          <div className="col-12 mt-4">
            <button
              className="btn btn-primary btn-lg px-5"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze News'}
            </button>
          </div>
        </form>
        {result &&
          <div className="mt-4">
            <strong>Detection Result:</strong>
            <span className={result === 'fake' ? 'text-danger' : 'text-success'} style={{ marginLeft: 10 }}>
              {result === 'fake' ? 'Fake News' : 'Real News'}
            </span>
          </div>
        }
      </div>
    </div>
  )
}
