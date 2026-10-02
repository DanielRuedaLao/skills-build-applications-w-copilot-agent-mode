import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import { API_BASE_URL } from './lib/api.js'
import './App.css'

const navigation = [
  { label: 'Users', path: '/users', index: '01' },
  { label: 'Teams', path: '/teams', index: '02' },
  { label: 'Activities', path: '/activities', index: '03' },
  { label: 'Leaderboard', path: '/leaderboard', index: '04' },
  { label: 'Workouts', path: '/workouts', index: '05' }
]

function App() {
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
          <div className="live-status"><span className="connection-light" aria-hidden="true" />DATA LIVE</div>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App