import { useCollection } from '../hooks/useCollection.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function Users() {
  const { items: users, status, error, retry } = useCollection('users')
  return (
    <section className="resource-page" aria-labelledby="users-title">
      <PageHeading id="users-title" index="01" title="People" description="Athletes keeping the team moving." count={users.length} noun="ATHLETES" />
      <ResourceState status={status} error={error} retry={retry} empty={!users.length} emptyTitle="No athletes yet" emptyMessage="Users will appear here once they join Octofit.">
        <div className="table-surface"><table className="data-table">
          <thead><tr><th>ATHLETE</th><th>POINTS</th><th>FITNESS LEVEL</th><th>TRAINING GOAL</th></tr></thead>
          <tbody>{users.map((user, index) => {
            const name = user.displayName || user.username || 'Octofit athlete'
            return (
              <tr key={user._id || user.id || user.email || index}>
                <td><div className="person-cell"><span className={`avatar avatar-tone-${index % 3}`} aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span><span className="person-name"><strong>{name}</strong><small>@{user.username || 'member'}</small></span></div></td>
                <td><span className="points-value">{Number(user.points || 0).toLocaleString()}</span></td>
                <td><span className="table-index">{user.fitnessLevel || 'beginner'}</span></td>
                <td><span className="table-index">{String(user.goal || 'general-fitness').replaceAll('-', ' ')}</span></td>
              </tr>
            )
          })}</tbody>
        </table></div>
      </ResourceState>
    </section>
  )
}

export default Users