import { useCollection } from '../hooks/useCollection.js'
import PageHeading from './PageHeading.jsx'
import ResourceState from './ResourceState.jsx'

function Workouts() {
  const { items: workouts, status, error, retry } = useCollection('workouts')
  return (
    <section className="resource-page" aria-labelledby="workouts-title">
      <PageHeading id="workouts-title" index="05" title="Workout library" description="Sessions for building strength, stamina and consistency." count={workouts.length} noun="PLANS" />
      <ResourceState status={status} error={error} retry={retry} empty={!workouts.length} emptyTitle="Library is empty" emptyMessage="Workouts added to the API will be listed here.">
        <div className="workout-grid">{workouts.map((workout, index) => {
          const exercises = Array.isArray(workout.exercises) ? workout.exercises : []
          return <article className="workout-card" key={workout._id || workout.id || workout.name || index}>
            <div className="workout-card-top"><span className={`difficulty-dot difficulty-${String(workout.difficulty || 'beginner').toLowerCase()}`} /><span>{workout.difficulty || 'Beginner'}</span><span className="workout-number">W{String(index + 1).padStart(2, '0')}</span></div>
            <h2>{workout.name || 'Workout plan'}</h2>
            <p className="workout-description">{workout.description || 'A session ready for your next training day.'}</p>
            <div className="exercise-heading"><span>EXERCISES</span><strong>{String(exercises.length).padStart(2, '0')}</strong></div>
            <ul className="exercise-list">{exercises.slice(0, 4).map((exercise, exerciseIndex) => {
              const name = typeof exercise === 'string' ? exercise : exercise.name || 'Exercise'
              const details = typeof exercise === 'object' ? [exercise.sets && `${exercise.sets} sets`, exercise.reps && `${exercise.reps} reps`].filter(Boolean).join(' · ') : ''
              return <li key={exercise._id || `${name}-${exerciseIndex}`}><span>{name}</span><small>{details || '—'}</small></li>
            })}{exercises.length > 4 && <li className="more-exercises">+ {exercises.length - 4} more</li>}</ul>
          </article>
        })}</div>
      </ResourceState>
    </section>
  )
}

export default Workouts