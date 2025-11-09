import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const [stats, setStats] = useState({ total: 0, fake: 0, real: 0, sources: 0 })
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/news')
      .then(res => {
        setArticles(res.data)
        setStats({
          total: res.data.length,
          fake: res.data.filter(a => a.status === 'fake').length,
          real: res.data.filter(a => a.status === 'real').length,
          sources: new Set(res.data.map(a => a.source)).size
        })
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load articles. Is your backend running?")
        setLoading(false)
      })
  }, [])

  const sourceStats = useMemo(() => {
    const stats = articles.reduce((acc, art) => {
      acc[art.source] = (acc[art.source] || 0) + 1
      return acc
    }, {})
    return Object.entries(stats).map(([name, count]) => ({ name, count }))
  }, [articles])

  return (
    <div className="container container-app">
      <div style={{ margin: 32 }}>
        <h2>Fake News Detector - Home</h2>
        <p>
          Welcome to the Fake News Detector. Analyze, submit, and review news authenticity.<br />
          {user ?
            <button className="btn btn-primary mt-3" onClick={() => navigate('/analyze')}>
              + Analyze News
            </button>
            :
            <span>
              <strong>Login</strong> or <strong>Signup</strong> to get started!
            </span>
          }
        </p>
      </div>

      {loading && <div style={{ color: "#888", margin: 32 }}>Loading articles...</div>}
      {error && <div style={{ color: "red", margin: 32 }}>{error}</div>}

      {!loading && !error &&
      <>
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card-app stats-card">
              <div className="stats-label">Total Articles</div>
              <div className="stats-value">{stats.total}</div>
              <div className="text-muted">Detected news</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-app stats-card">
              <div className="stats-label">Fake News</div>
              <div className="stats-value text-danger">{stats.fake}</div>
              <div className="text-muted">Flagged stories</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-app stats-card">
              <div className="stats-label">Real News</div>
              <div className="stats-value text-success">{stats.real}</div>
              <div className="text-muted">Verified stories</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-app stats-card">
              <div className="stats-label">Sources</div>
              <div className="stats-value">{stats.sources}</div>
              <div className="text-muted">Unique sources</div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-8">
            <div className="card-app">
              <div className="p-4 border-bottom border-secondary">
                <h5 className="m-0">Fake News Alerts</h5>
                <div className="text-muted">Flagged articles needing review</div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Source</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.filter(a => a.status === 'fake').length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-muted text-center">No fake news detected!</td>
                      </tr>
                    )}
                    {articles.filter(a => a.status === 'fake').map(a => (
                      <tr key={a._id}>
                        <td>{a.title}</td>
                        <td>{a.source}</td>
                        <td>
                          <span className="badge bg-danger-subtle text-danger rounded-pill px-3">
                            Fake
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-app">
              <div className="p-4 border-bottom border-secondary">
                <h5 className="m-0">Sources Overview</h5>
                <div className="text-muted">Distribution by source</div>
              </div>
              <div className="p-4">
                {sourceStats.length === 0 ? (
                  <div className="text-muted">No articles yet.</div>
                ) : (
                  sourceStats.map(cat => (
                    <div key={cat.name} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>{cat.name}</span>
                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3">
                          {cat.count} article{cat.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${(cat.count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card-app">
          <div className="p-4 border-bottom border-secondary">
            <h4 className="m-0">Recent Articles</h4>
            <div className="text-muted">Latest submissions</div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-muted text-center">No articles found.</td>
                  </tr>
                )}
                {articles.slice(0, 5).map(a => (
                  <tr key={a._id}>
                    <td>{a.title}</td>
                    <td className="text-muted">{a.source}</td>
                    <td>
                      <span className={`badge bg-${a.status === 'real' ? 'success' : 'danger'}-subtle text-${a.status === 'real' ? 'success' : 'danger'} rounded-pill px-3`}>
                        {a.status === 'real' ? 'Real' : 'Fake'}
                      </span>
                    </td>
                    <td>{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
      }
    </div>
  )
}
