export interface TakeoverBannerProps {
  enabled: boolean
}

export function TakeoverBanner({ enabled }: TakeoverBannerProps) {
  return (
    <section
      aria-label="EmCanvas takeover status"
      className={`emc-takeover-banner emc-takeover-banner--${enabled ? 'enabled' : 'disabled'}`}
    >
      <p>
        {enabled ? 'EmCanvas takeover enabled' : 'EmCanvas takeover disabled'}
      </p>
    </section>
  )
}

export default TakeoverBanner
