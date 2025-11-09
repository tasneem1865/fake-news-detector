import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch articles from API backend
    api.get('/news').then(res => setArticles(res.data))
    .catch(err => console.error(err))
  }, [])

  // Extract unique sources + add "All" option
  const sources = ['All', ...Array.from(new Set(articles.map(a => a.source)))]

  // Filter articles by source and search term (title/content)
  const filteredArticles = articles.filter(a => {
    const matchesSource = sourceFilter === 'All' || a.source === sourceFilter
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
    return matchesSource && matchesSearch
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return
    try {
      await api.delete(`/news/${id}`)
      setArticles(prev => prev.filter(a => a._id !== id))
    } catch (err) { 
      console.error(err) 
    }
  }

  return (
    <div className="container container-app">
      <div className="card-app p-4 mb-4">
        <h4 className="mb-4">Search & Filter News</h4>
        
        <div className="d-flex gap-3 align-items-center mb-4">
          <input 
            type="text" 
            className="form-control form-control-lg"
            placeholder="Search by title or content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select 
            className="form-select form-select-lg"
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
          >
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-app">
        <div className="p-4 border-bottom border-secondary">
          <h4 className="m-0">News Articles</h4>
          <div className="text-muted">Showing {filteredArticles.length} of {articles.length} articles</div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(a => (
                <tr key={a._id} style={{ cursor: 'pointer' }}>
                  <td onClick={() => navigate(`/news/${a._id}`)}>{a.title}</td>
                  <td className="text-muted">{a.source}</td>
                  <td>
                    <span className={`badge bg-${a.status === 'real' ? 'success' : 'danger'}-subtle text-${a.status === 'real' ? 'success' : 'danger'} rounded-pill px-3`}>
                      {a.status === 'real' ? 'Real' : 'Fake'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-link btn-sm text-primary p-0 me-3"
                      onClick={() => navigate(`/news/${a._id}/edit`)}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button 
                      className="btn btn-link btn-sm text-danger p-0"
                      onClick={() => handleDelete(a._id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No articles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
