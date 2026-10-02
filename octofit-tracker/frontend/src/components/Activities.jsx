import { useCollection } from '../hooks/useCollection.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function formatDate(value) {
  if (!value) return 'DATE NOT SET'
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? 'DATE NOT SET' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function Activities() {
  const { items: activities, status, error, retry } = useCollection('activities')
  return (
    <section className="resource-page" aria-labelledby="activities-title">
      <PageHeading id="activities-title" index="03" title="Activity log" description="Every session counts. Keep an eye on the work behind the wins." count={activities.length} noun="SESSIONS" />
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