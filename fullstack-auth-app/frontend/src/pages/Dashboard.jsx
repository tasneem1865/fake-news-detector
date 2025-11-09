import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0, fake: 0, real: 0, sources: 0
  })
  const [articles, setArticles] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch articles from backend
    api.get('/news').then(res => {
      setArticles(res.data)
      setStats({
        total: res.data.length,
        fake: res.data.filter(a => a.status === 'fake').length,
        real: res.data.filter(a => a.status === 'real').length,
        sources: new Set(res.data.map(a => a.source)).size
      })
    })
  }, [])

  const sourceStats = articles.reduce((acc, a) => {
    acc[a.source] = (acc[a.source] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container container-app">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="m-0">Fake News Detector Dashboard</h4>
          <p className="text-muted mb-0">Track, analyze, and review detected news articles</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/analyze')}>+ Analyze News</button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card-app stats-card">
            <div className="stats-label">Total Articles</div>
            <div className="stats-value">{stats.total}</div>
            <div className="text-muted">Detected news stories</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-app stats-card">
            <div className="stats-label">Fake News</div>
            <div className="stats-value text-danger">{stats.fake}</div>
            <div className="text-muted">Flagged by system</div>
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
            <div className="text-muted">Unique publishers</div>
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
                  {articles.filter(a => a.status === 'fake').map(a => (
                    <tr key={a._id} onClick={() => navigate(`/news/${a._id}`)} style={{ cursor: 'pointer' }}>
                      <td>{a.title}</td>
                      <td>{a.source}</td>
                      <td>
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-3">Fake</span>
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
              <h5 className="m-0">Source Overview</h5>
              <div className="text-muted">Distribution by source</div>
            </div>
            <div className="p-4">
              {Object.entries(sourceStats).map(([source, count]) => (
                <div key={source} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>{source}</span>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{count} articles</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" style={{ width: `${(count / articles.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card-app">
        <div className="p-4 border-bottom border-secondary">
          <h4 className="m-0">Recent News Articles</h4>
          <div className="text-muted">Latest news submissions</div>
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
              {articles.map(a => (
                <tr key={a._id} onClick={() => navigate(`/news/${a._id}`)} style={{ cursor: 'pointer' }}>
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
    </div>
  )
}
