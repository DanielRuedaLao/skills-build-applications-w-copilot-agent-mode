import { useState } from 'react'
import { useCollection } from '../hooks/useCollection.js'
import { requestApi } from '../lib/api.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function memberLabel(member) {
  if (member && typeof member === 'object') return member.displayName || member.username || 'Member'
  return typeof member === 'string' ? `Member ${member.slice(-4)}` : 'Member'
}

function Teams({ currentUser }) {
  const { items: teams, status, error, retry } = useCollection('teams')
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [busyTeam, setBusyTeam] = useState('')
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')

  async function createTeam(event) {
    event.preventDefault()
    setSaving(true)
    setActionError('')
    setNotice('')
    try {
      await requestApi('/teams', { method: 'POST', body: JSON.stringify(form) })
      setForm({ name: '', description: '' })
      setNotice('Team created. You are its first member.')
      retry()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function joinTeam(team) {
    setBusyTeam(String(team._id || team.id))
    setActionError('')
    setNotice('')
    try {
      await requestApi(`/teams/${team._id || team.id}/join`, { method: 'POST' })
      setNotice(`You joined ${team.name}.`)
      retry()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setBusyTeam('')
    }
  }

  return (
    <section className="resource-page" aria-labelledby="teams-title">
      <PageHeading id="teams-title" index="02" title="Teams" description="Small crews, shared momentum." count={teams.length} noun="TEAMS" />
      <form className="collection-form" onSubmit={createTeam}>
        <div className="form-heading"><div><span className="eyebrow"><span>TEAM UP</span> COMMUNITY</span><h2>Create a team</h2></div><button className="primary-action" disabled={saving} type="submit">{saving ? 'Creating…' : 'Create team'}</button></div>
        <div className="form-pair"><label>Team name<input maxLength="60" name="name" onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} required value={form.name} /></label><label>Description<input maxLength="240" name="description" onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} value={form.description} /></label></div>
        {actionError && <p className="form-error" role="alert">{actionError}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
      </form>
      <ResourceState status={status} error={error} retry={retry} empty={!teams.length} emptyTitle="No teams yet" emptyMessage="Create a team to start building momentum together.">
        <div className="team-list">{teams.map((team, index) => {
          const members = Array.isArray(team.members) ? team.members : []
          return (
            <article className="team-row" key={team._id || team.id || team.name || index}>
              <div className="team-number">T{String(index + 1).padStart(2, '0')}</div>
              <div className="team-main">
                <div className="team-heading-line"><h2>{team.name || 'Untitled team'}</h2><span className="member-count">{members.length} MEMBERS</span></div>
                <p>{team.description || 'Ready for the next challenge.'}</p>
                <div className="member-list">{members.slice(0, 5).map((member, memberIndex) => (
                  <span className="member-chip" key={member?._id || member?.id || `${String(member)}-${memberIndex}`}>{memberLabel(member)}</span>
                ))}{members.length > 5 && <span className="member-chip">+{members.length - 5} more</span>}</div>
              </div>
              <div className="team-actions">{members.some((member) => String(member?._id || member?.id || member) === currentUser.id) ? <span className="joined-label">JOINED</span> : <button className="text-action" disabled={busyTeam === String(team._id || team.id)} onClick={() => joinTeam(team)} type="button">{busyTeam === String(team._id || team.id) ? 'Joining…' : 'Join team'}</button>}<div className={`team-stamp team-stamp-${index % 2}`} aria-hidden="true">{String(team.name || 'T').slice(0, 1).toUpperCase()}</div></div>
            </article>
          )
        })}</div>
      </ResourceState>
    </section>
  )
}

export default Teams