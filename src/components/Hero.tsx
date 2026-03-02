import './hero.css'

type HeroProps = {
  loading: boolean
  error: string | null
  title: string
  subtitle: string
  plot: string
  backdropPosterUrl: string
}

export function Hero(props: HeroProps) {
  const bg = props.backdropPosterUrl && props.backdropPosterUrl !== 'N/A' ? `url(${props.backdropPosterUrl})` : undefined

  return (
    <section className="hero" aria-label="Featured title">
      <div className="hero__bg" style={bg ? { backgroundImage: bg } : undefined} />
      <div className="hero__vignette" />

      <div className="hero__content">
        {props.loading ? (
          <div className="hero__skeleton" aria-label="Loading featured title">
            <div className="sk sk--title" />
            <div className="sk sk--meta" />
            <div className="sk sk--line" />
            <div className="sk sk--line" />
            <div className="hero__actions">
              <div className="sk sk--btn" />
              <div className="sk sk--btn2" />
            </div>
          </div>
        ) : props.error ? (
          <div className="hero__error" role="alert">
            Failed to load featured title: {props.error}
          </div>
        ) : (
          <>
            <div className="hero__badge">FEATURED</div>
            <h1 className="hero__title">{props.title}</h1>
            <div className="hero__meta">{props.subtitle}</div>
            {props.plot ? <p className="hero__plot">{props.plot}</p> : null}
            <div className="hero__actions">
              <button className="btn btn--primary" type="button">
                ▶ Play
              </button>
              <button className="btn btn--secondary" type="button">
                ℹ More Info
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

