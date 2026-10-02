function ResourceState({ status, error, retry, empty, emptyTitle, emptyMessage, children }) {
  if (status === 'loading') {
    return <div className="resource-state" role="status"><span className="loading-mark" aria-hidden="true" />Loading records</div>
  }
  if (status === 'error') {
    return (
      <div className="resource-state error-state" role="alert">
        <strong>Could not load this view</strong><span>{error}</span>
        <button className="text-action" type="button" onClick={retry}>Retry request</button>
      </div>
    )
  }
  if (empty) {
    return <div className="resource-state empty-state"><span className="empty-index">00</span><strong>{emptyTitle}</strong><span>{emptyMessage}</span></div>
  }
  return children
}

export default ResourceState