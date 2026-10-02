import { useCollection } from '../hooks/useCollection.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function memberLabel(member) {
  if (member && typeof member === 'object') return member.displayName || member.username || 'Member'
  return typeof member === 'string' ? `Member ${member.slice(-4)}` : 'Member'
}

function Teams() {
  const { items: teams, status, error, retry } = useCollection('teams')
  return (
    <section className="resource-page" aria-labelledby="teams-title">
      <PageHeading id="teams-title" index="02" title="Teams" description="Small crews, shared momentum." count={teams.length} noun="TEAMS" />
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
              <div className={`team-stamp team-stamp-${index % 2}`} aria-hidden="true">{String(team.name || 'T').slice(0, 1).toUpperCase()}</div>
            </article>
          )
        })}</div>
      </ResourceState>
    </section>
  )
}

export default Teams