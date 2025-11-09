import React from 'react'
import './styles.css'                     // ensure styles are loaded
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import NewsForm from './pages/NewsForm'
import Results from './pages/Results'
import Publishers from './pages/publishers'  // keep your filename
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <header>
            <Navbar />
          </header>

          <main className="app-content container-app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
              <Route path="/news/new" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/publishers" element={<ProtectedRoute><Publishers /></ProtectedRoute>} />
            </Routes>
          </main>

          <footer className="app-footer center" style={{ padding: 20, color: '#6b7280' }}>
            © {new Date().getFullYear()} Fake News Detector
          </footer>
        </div>
      </Router>
    </AuthProvider>
  )
}
