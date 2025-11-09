import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Navbar with improved, human-friendly notifications
 * - clear categories (alert/info/success)
 * - unique ids
 * - humanized time (e.g. "2h ago")
 * - "Mark all read" and single-item mark-as-read behavior
 * - accessible labels and empty-state
 *
 * File name must remain: src/components/Navbar.jsx
 */

const timeAgo = (iso) => {
  if (!iso) return ''
  const then = new Date(iso)
  const diff = Math.floor((Date.now() - then.getTime()) / 1000) // seconds
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const iconForType = (type) => {
  // return simple SVG string or element; keeps appearance distinct per type
  switch (type) {
    case 'alert':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
          <path d="M12 9v4" stroke="#ff6f61" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M12 17h.01" stroke="#ff6f61" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ff6f61" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
        </svg>
      )
    case 'success':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
          <path d="M20 6L9 17l-5-5" stroke="#60c689" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
          <circle cx="12" cy="12" r="9" stroke="#475569" strokeWidth="1.2" fill="none" />
          <path d="M12 8v4" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          <path d="M12 16h.01" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        </svg>
      )
  }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenu, setUserMenu] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const userMenuRef = useRef(null)
  const notifRef = useRef(null)

  // clearer, unique notifications example — in real app load from API
  const [notifications, setNotifications] = useState([
    {
      id: 'n-20251108-01',
      type: 'alert',
      title: 'High-Risk Article Flagged',
      message: 'An article entitled "Miracle Cure" was flagged for review — contains sensational language.',
      link: '/results/flagged',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      read: false
    },
    {
      id: 'n-20251107-02',
      type: 'success',
      title: 'Publisher Verified',
      message: 'Source "Trusted Gazette" was verified and added to the safe list.',
      link: '/publishers',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26h ago
      read: false
    },
    {
      id: 'n-20251105-03',
      type: 'info',
      title: 'Model Update Available',
      message: 'A new detection model is ready for deployment (v1.1).',
      link: '/dashboard',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3d ago
      read: true
    }
  ])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markReadAndGo = (id, link) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
    setNotifOpen(false)
    if (link) navigate(link)
  }

  const handleLogout = () => {
    logout && logout()
    navigate('/login')
  }

  const activeClass = ({ isActive }) =>
    isActive ? 'nav-link active-link' : 'nav-link'

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <nav className="app-navbar" aria-label="Main navigation">
      <div className="container-app d-flex align-items-center justify-content-between">
        <NavLink to="/" className="navbar-brand">
          <svg width="34" height="34" viewBox="0 0 24 24" style={{ borderRadius: 8, background: '#fff', padding: 4 }}>
            <rect width="24" height="24" rx="6" fill="#f3f4ff" />
            <path d="M6 12h12" stroke="#786ff6" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 8h12" stroke="#4ad7d1" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          </svg>
          <span style={{ marginLeft: 8 }}>Fake News Detector</span>
        </NavLink>

        <ul className="nav-links" role="menubar" aria-label="Primary">
          <li><NavLink to="/" className={activeClass}>Home</NavLink></li>
          <li><NavLink to="/dashboard" className={activeClass}>Dashboard</NavLink></li>
          <li><NavLink to="/analyze" className={activeClass}>Analyze News</NavLink></li>
          <li><NavLink to="/results" className={activeClass}>Results</NavLink></li>
          <li><NavLink to="/publishers" className={activeClass}>Publishers</NavLink></li>
        </ul>

        <div className="nav-actions d-flex align-items-center gap-3">
          {/* Notification area */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="btn-notify"
              title="Notifications"
              onClick={() => setNotifOpen(v => !v)}
              aria-haspopup="true"
              aria-expanded={notifOpen}
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              {/* Bell icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 17H9a3 3 0 01-3-3 6 6 0 00-2-4V8a6 6 0 1112 0v2a6 6 0 00-2 4 3 3 0 01-3 3z" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {unreadCount > 0 && (
                <span className="notify-badge" aria-hidden>{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="notify-dropdown" role="dialog" aria-label="Notifications panel">
                <div style={{ padding: 12, borderBottom: '1px solid #f3f6fb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Notifications</strong>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', fontSize: 13 }}>{unreadCount} unread</span>
                    <button onClick={markAllRead} style={{ border: 'none', background: 'transparent', color: '#6b7280', cursor: 'pointer' }}>Mark all read</button>
                  </div>
                </div>

                <div className="notify-list" style={{ maxHeight: 300, overflow: 'auto' }}>
                  {notifications.length === 0 && (
                    <div style={{ padding: 14, color: '#6b7280' }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>You're all caught up</div>
                      <div style={{ fontSize: 13 }}>No notifications at the moment.</div>
                    </div>
                  )}

                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`notify-item ${n.read ? 'read' : 'unread'}`}
                      onClick={() => markReadAndGo(n.id, n.link)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') markReadAndGo(n.id, n.link) }}
                      style={{
                        padding: 12,
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        background: n.read ? '#fff' : 'linear-gradient(90deg,#fbfbff,#fff)',
                        borderBottom: '1px solid #f3f6fb',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {iconForType(n.type)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ fontWeight: 700, color: '#23395d' }}>{n.title}</div>
                          <div style={{ color: '#6b7280', fontSize: 12 }}>{timeAgo(n.timestamp)}</div>
                        </div>
                        <div style={{ color: '#475569', marginTop: 6, fontSize: 13 }}>{n.message}</div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)) }}
                            style={{ border: '1px solid #e6e9f2', background: '#fff', padding: '6px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
                          >
                            {n.read ? 'Read' : 'Mark read'}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(n.link); setNotifOpen(false) }}
                            style={{ border: 'none', background: 'transparent', color: '#786ff6', cursor: 'pointer', fontSize: 12 }}
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 10, borderTop: '1px solid #f3f6fb', textAlign: 'center' }}>
                  <button onClick={() => { navigate('/results'); setNotifOpen(false) }} style={{ border: 'none', background: 'transparent', color: '#786ff6', cursor: 'pointer' }}>View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Auth buttons / user menu (unchanged) */}
          {!user ? (
            <>
              <NavLink to="/signup" className="btn secondary">Signup</NavLink>
              <NavLink to="/login" className="btn">Login</NavLink>
            </>
          ) : (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button className="user-avatar" onClick={() => setUserMenu(v => !v)} aria-haspopup="true" aria-expanded={userMenu}>
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: 36, height: 36, borderRadius: 8 }} /> : <span className="avatar-initial">{(user?.name || 'U').charAt(0)}</span>}
              </button>

              {userMenu && (
                <div className="user-dropdown" role="menu" aria-label="User menu" style={{ right: 0, top: '56px' }}>
                  <div style={{ padding: 12, borderBottom: '1px solid #f3f6fb', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div>{user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: 8 }} /> : <div className="avatar-initial" style={{ width: 40, height: 40 }}>{(user?.name || 'U').charAt(0)}</div>}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{user?.name || 'User'}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{user?.email}</div>
                    </div>
                  </div>
                  <div style={{ padding: 8 }}>
                    <button onClick={() => { navigate('/profile'); setUserMenu(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}>Profile</button>
                    <button onClick={() => { navigate('/settings'); setUserMenu(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}>Settings</button>
                  </div>
                  <div style={{ padding: 10, borderTop: '1px solid #f3f6fb', textAlign: 'right' }}>
                    <button onClick={handleLogout} style={{ background: '#ff6f61', color: '#fff', padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
