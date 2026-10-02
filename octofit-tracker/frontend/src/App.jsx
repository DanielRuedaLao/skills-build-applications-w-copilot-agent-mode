import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import AuthPage from './components/AuthPage.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import Profile from './components/Profile.jsx'
import { API_BASE_URL, requestApi, SESSION_KEY } from './lib/api.js'
import './App.css'

const navigation = [
  { label: 'Users', path: '/users', index: '01' },
  { label: 'Teams', path: '/teams', index: '02' },
  { label: 'Activities', path: '/activities', index: '03' },
  { label: 'Leaderboard', path: '/leaderboard', index: '04' },
  { label: 'Workouts', path: '/workouts', index: '05' },
  { label: 'Profile', path: '/profile', index: '06' }
]

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(SESSION_KEY))
  const [user, setUser] = useState(null)
  const [loadingSession, setLoadingSession] = useState(Boolean(token))
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    if (!token) return undefined

    const controller = new AbortController()
    requestApi('/auth/me', { signal: controller.signal })
      .then(setUser)
      .catch((error) => {
        if (error.name === 'AbortError') return
        if (error.status === 401) {
          localStorage.removeItem(SESSION_KEY)
          setToken(null)
          setUser(null)
        } else {
          setSessionError(error.message)
        }
      })
      .finally(() => setLoadingSession(false))
    return () => controller.abort()
  }, [token])

  function handleAuthenticated(session) {
    localStorage.setItem(SESSION_KEY, session.token)
    setToken(session.token)
    setUser(session.user)
    setSessionError('')
  }

  function handleSignOut() {
    localStorage.removeItem(SESSION_KEY)
    setToken(null)
    setUser(null)
    setSessionError('')
  }

  if (loadingSession) {
    return <main className="auth-page"><div className="resource-state" role="status"><span className="loading-mark" aria-hidden="true" />Checking your session</div></main>
  }
  if (sessionError) {
    return <main className="auth-page"><div className="resource-state error-state" role="alert"><strong>Could not connect to Octofit</strong><span>{sessionError}</span><button className="text-action" onClick={() => window.location.reload()} type="button">Retry</button><button className="text-action" onClick={handleSignOut} type="button">Sign out</button></div></main>
  }
  if (!token || !user) return <AuthPage onAuthenticated={handleAuthenticated} />

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <NavLink className="brand-lockup" to="/users" aria-label="Octofit home">
          <img src={logo} alt="" className="brand-logo" />
          <span className="brand-type"><strong>OCTOFIT</strong><span>TRAINING CLUB</span></span>
        </NavLink>
        <div className="rail-caption">YOUR WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink className="nav-item" key={item.path} to={item.path}>
              <span className="nav-index">{item.index}</span><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-footer">
          <span className="connection-light" aria-hidden="true" />
          <span><strong>API CONNECTION</strong><small>{API_BASE_URL.replace(/^https?:\/\//, '')}</small></span>
        </div>
      </aside>
      <main className="main-column">
        <header className="topbar">
          <div><span className="topbar-kicker">OCTOFIT TRACKER</span><span className="topbar-divider">/</span><span className="topbar-context">Team performance</span></div>
          <div className="topbar-actions"><NavLink className="topbar-user" to="/profile">{user.displayName || user.username}</NavLink><button className="sign-out-action" onClick={handleSignOut} type="button">Sign out</button><div className="live-status"><span className="connection-light" aria-hidden="true" />DATA LIVE</div></div>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams currentUser={user} />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts user={user} />} />
            <Route path="/profile" element={<Profile user={user} onUserUpdated={setUser} />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App