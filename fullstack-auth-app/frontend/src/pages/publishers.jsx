import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function Sources() {
  const [sources, setSources] = useState([])

  useEffect(() => {
    // Fetch distinct sources from your backend or static sample
    // Example: Assuming your backend has an API for sources
    api.get('/news/sources').then(res => setSources(res.data)).catch(err => console.error(err))
  }, [])

  return (
    <div className="container container-app">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">News Sources</h2>
        {/* Optionally add button for adding sources if your app supports it */}
      </div>

      <div className="card-app p-3">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Source Name</th>
              <th>URL</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-muted text-center">No sources available</td>
              </tr>
            ) : (
              sources.map(source => (
                <tr key={source.id || source.name}>
                  <td>{source.name}</td>
                  <td><a href={source.url} target="_blank" rel="noopener noreferrer">{source.url}</a></td>
                  <td>{source.verified ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
