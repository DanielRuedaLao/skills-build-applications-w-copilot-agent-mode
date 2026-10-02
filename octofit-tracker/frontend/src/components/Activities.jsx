import { useState } from 'react'
import { useCollection } from '../hooks/useCollection.js'
import { requestApi } from '../lib/api.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function formatDate(value) {
  if (!value) return 'DATE NOT SET'
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? 'DATE NOT SET' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function Activities() {
  const { items: activities, status, error, retry } = useCollection('activities')
  const [form, setForm] = useState({ type: 'Running', durationMinutes: '', calories: '' })
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')

  async function logActivity(event) {
    event.preventDefault()
    setSaving(true)
    setActionError('')
    setNotice('')
    try {
      const result = await requestApi('/activities', {
        method: 'POST',
        body: JSON.stringify({
          type: form.type,
          durationMinutes: Number(form.durationMinutes),
          ...(form.calories ? { calories: Number(form.calories) } : {})
        })
      })
      setForm((current) => ({ ...current, durationMinutes: '', calories: '' }))
      setNotice(`Session logged. +${result.pointsEarned} points added to your total.`)
      retry()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="resource-page" aria-labelledby="activities-title">
      <PageHeading id="activities-title" index="03" title="Activity log" description="Every session counts. Keep an eye on the work behind the wins." count={activities.length} noun="SESSIONS" />
      <form className="collection-form" onSubmit={logActivity}>
        <div className="form-heading"><div><span className="eyebrow"><span>LOG IT</span> DAILY MOVEMENT</span><h2>Record a session</h2></div><button className="primary-action" disabled={saving} type="submit">{saving ? 'Saving…' : 'Add activity'}</button></div>
        <div className="form-pair activity-form-fields"><label>Activity<select onChange={(event) => setForm((value) => ({ ...value, type: event.target.value }))} value={form.type}><option>Running</option><option>Walking</option><option>Cycling</option><option>Swimming</option><option>Strength</option><option>Yoga</option><option>Other</option></select></label><label>Duration (minutes)<input max="1440" min="1" onChange={(event) => setForm((value) => ({ ...value, durationMinutes: event.target.value }))} required type="number" value={form.durationMinutes} /></label><label>Calories (optional)<input max="20000" min="0" onChange={(event) => setForm((value) => ({ ...value, calories: event.target.value }))} type="number" value={form.calories} /></label></div>
        {actionError && <p className="form-error" role="alert">{actionError}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
      </form>
      <ResourceState status={status} error={error} retry={retry} empty={!activities.length} emptyTitle="No activity logged" emptyMessage="Completed sessions will show up here.">
        <div className="table-surface"><table className="data-table activity-table">
          <thead><tr><th>SESSION</th><th>ATHLETE</th><th>DURATION</th><th>ENERGY</th><th>COMPLETED</th></tr></thead>
          <tbody>{activities.map((activity, index) => {
            const athlete = activity.user?.displayName || activity.user?.username || activity.user
            return (
              <tr key={activity._id || activity.id || index}>
                <td><div className="activity-type"><span className={`activity-marker marker-${index % 3}`} aria-hidden="true" /><strong>{activity.type || 'Training session'}</strong></div></td>
                <td>{athlete ? String(athlete).slice(-18) : 'Unassigned'}</td>
                <td><strong>{Number(activity.durationMinutes || 0)} min</strong></td>
                <td>{activity.calories == null ? '—' : `${Number(activity.calories).toLocaleString()} kcal`}</td>
                <td><span className="table-index">{formatDate(activity.completedAt)}</span></td>
              </tr>
            )
          })}</tbody>
        </table></div>
      </ResourceState>
    </section>
  )
}

export default Activities