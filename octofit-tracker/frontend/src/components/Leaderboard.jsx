import { useCollection } from '../hooks/useCollection.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function Leaderboard() {
  const ranking = useCollection('leaderboard')
  const users = useCollection('users')
  const isLoading = ranking.status === 'loading' || users.status === 'loading'
  const error = ranking.error || users.error
  const retry = () => { ranking.retry(); users.retry() }
  const userNames = new Map(users.items.map((user) => [String(user._id || user.id), user.displayName || user.username]))

  return (
    <section className="resource-page" aria-labelledby="leaderboard-title">
      <PageHeading id="leaderboard-title" index="04" title="Leaderboard" description="A little friendly competition goes a long way." count={ranking.items.length} noun="RANKED" />
      <ResourceState status={isLoading ? 'loading' : error ? 'error' : 'success'} error={error} retry={retry} empty={!ranking.items.length} emptyTitle="No scores to rank" emptyMessage="Point totals will appear when activities are logged.">
        <div className="leaderboard-surface">
          <div className="leaderboard-head"><span>RANK</span><span>ATHLETE</span><span>PERIOD</span><span>POINTS</span></div>
          {ranking.items.map((entry, index) => {
            const userId = entry.user?._id || entry.user?.id || entry.user
            const name = entry.displayName || userNames.get(String(userId)) || 'Octofit member'
            return <div className={`leader-row ${index < 3 ? `leader-row-${index + 1}` : ''}`} key={entry._id || entry.id || index}>
              <span className="rank-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="leader-name"><span className={`avatar avatar-tone-${index % 3}`} aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span><strong>{name}</strong></span>
              <span className="leader-period">{entry.period || 'ALL-TIME'}</span>
              <strong className="leader-points">{Number(entry.points || 0).toLocaleString()} <small>PTS</small></strong>
            </div>
          })}
        </div>
      </ResourceState>
    </section>
  )
}

export default Leaderboard