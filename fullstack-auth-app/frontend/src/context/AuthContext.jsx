import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    // try to fetch user info
    const load = async () => {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user || null)
      } catch (err) {
        console.error('Auth fetch failed', err)
        setUser(null)
      }
    }
    load()
  }, [])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    if (data.user) setUser(data.user)
  }
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
