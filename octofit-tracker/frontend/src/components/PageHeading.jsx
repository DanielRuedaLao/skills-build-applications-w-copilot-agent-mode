function PageHeading({ id, index, title, description, count, noun }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow"><span>{index}</span> / OCTOFIT DATABASE</p>
        <h1 id={id}>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      <div className="record-count" aria-label={`${count} ${noun}`}>
        <strong>{String(count).padStart(2, '0')}</strong><span>{noun}</span>
      </div>
    </div>
  )
}

export default PageHeading