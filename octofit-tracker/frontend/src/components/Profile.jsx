import { useState } from 'react'
import { requestApi } from '../lib/api.js'
import PageHeading from './PageHeading.jsx'

function Profile({ user, onUserUpdated }) {
  const [form, setForm] = useState({ displayName: user.displayName || '', fitnessLevel: user.fitnessLevel || 'beginner', goal: user.goal || 'general-fitness' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setSaved(false)
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('saving')
    setError('')
    try {
      const updatedUser = await requestApi('/auth/profile', { method: 'PATCH', body: JSON.stringify(form) })
      onUserUpdated(updatedUser)
      setSaved(true)
      setStatus('idle')
    } catch (requestError) {
      setError(requestError.message)
      setStatus('idle')
    }
  }

  return (
    <section className="resource-page" aria-labelledby="profile-title">
      <PageHeading id="profile-title" index="06" title="Your profile" description="Set your training level and the goals that shape your recommendations." count={user.points || 0} noun="POINTS" />
      <form className="profile-form form-stack" onSubmit={submit}>
        <div className="profile-identity"><span className="avatar" aria-hidden="true">{(user.displayName || user.username).slice(0, 1).toUpperCase()}</span><div><strong>{user.displayName || user.username}</strong><small>@{user.username} · {user.email}</small></div></div>
        <label>Display name<input autoComplete="name" maxLength="80" name="displayName" onChange={updateField} value={form.displayName} /></label>
        <div className="form-pair">
          <label>Fitness level<select name="fitnessLevel" onChange={updateField} value={form.fitnessLevel}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
          <label>Training goal<select name="goal" onChange={updateField} value={form.goal}><option value="general-fitness">General fitness</option><option value="cardio">Cardio</option><option value="strength">Strength</option><option value="mobility">Mobility</option></select></label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="form-success" role="status">Profile updated.</p>}
        <button className="primary-action" disabled={status === 'saving'} type="submit">{status === 'saving' ? 'Saving…' : 'Save profile'}</button>
      </form>
    </section>
  )
}

export default Profile
