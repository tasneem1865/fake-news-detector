import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', form)
      if (res.data?.token) {
        login(res.data)
        navigate('/dashboard')
      }
    } catch (err) { console.error(err) }
  }

  return (
    <div className="container container-app">
      <div className="card card-app p-4" style={{ maxWidth: 540, margin: '80px auto' }}>
        <h2 className="mb-4 text-white fw-bold">Sign in to Fake News Detector</h2>
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-12">
            <label className="form-label">Email</label>
            <input 
              className="form-control form-control-lg" 
              name="email" 
              type="email"
              placeholder="Enter your email" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input 
              className="form-control form-control-lg" 
              name="password" 
              type="password" 
              placeholder="Enter your password"
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="col-12 mt-4">
            <button className="btn btn-primary btn-lg w-100" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
