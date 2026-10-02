import { useState } from 'react'
import logo from '../../../../docs/octofitapp-small.png'
import { requestApi } from '../lib/api.js'

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ identifier: '', username: '', email: '', displayName: '', password: '', fitnessLevel: 'beginner', goal: 'general-fitness' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const isRegistering = mode === 'register'

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const body = isRegistering
        ? { username: form.username, email: form.email, displayName: form.displayName, password: form.password, fitnessLevel: form.fitnessLevel, goal: form.goal }
        : { identifier: form.identifier, password: form.password }
      const session = await requestApi(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) })
      onAuthenticated(session)
    } catch (requestError) {
      setError(requestError.message)
      setStatus('idle')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <img src={logo} alt="" className="auth-logo" />
        <p className="eyebrow"><span>OCTOFIT</span> TRAINING CLUB</p>
        <h1 id="auth-title">{isRegistering ? 'Join the club' : 'Welcome back'}</h1>
        <p className="page-description">{isRegistering ? 'Create your athlete profile and find your next training goal.' : 'Sign in to see your team and keep your training moving.'}</p>
        <form className="form-stack auth-form" onSubmit={submit}>
          {isRegistering ? <>
            <label>Display name<input autoComplete="name" maxLength="80" name="displayName" onChange={updateField} value={form.displayName} /></label>
            <div className="form-pair">
              <label>Username<input autoComplete="username" maxLength="24" minLength="3" name="username" onChange={updateField} required value={form.username} /></label>
              <label>Email<input autoComplete="email" name="email" onChange={updateField} required type="email" value={form.email} /></label>
            </div>
            <div className="form-pair">
              <label>Fitness level<select name="fitnessLevel" onChange={updateField} value={form.fitnessLevel}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
              <label>Training goal<select name="goal" onChange={updateField} value={form.goal}><option value="general-fitness">General fitness</option><option value="cardio">Cardio</option><option value="strength">Strength</option><option value="mobility">Mobility</option></select></label>
            </div>
          </> : <label>Username or email<input autoComplete="username" name="identifier" onChange={updateField} required value={form.identifier} /></label>}
          <label>Password<input autoComplete={isRegistering ? 'new-password' : 'current-password'} minLength={isRegistering ? 8 : undefined} name="password" onChange={updateField} required type="password" value={form.password} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-action" disabled={status === 'submitting'} type="submit">{status === 'submitting' ? 'Connecting…' : isRegistering ? 'Create profile' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">{isRegistering ? 'Already part of Octofit?' : 'New to Octofit?'} <button type="button" onClick={() => { setError(''); setMode(isRegistering ? 'login' : 'register') }}>{isRegistering ? 'Sign in' : 'Create an account'}</button></p>
      </section>
    </main>
  )
}

export default AuthPage
