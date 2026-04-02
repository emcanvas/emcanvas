export interface TakeoverBannerProps {
  enabled: boolean
}

export function TakeoverBanner({ enabled }: TakeoverBannerProps) {
  return (
    <section aria-label="EmCanvas takeover status">
      <p>{enabled ? 'EmCanvas takeover enabled' : 'EmCanvas takeover disabled'}</p>
    </section>
  )
}

export default TakeoverBanner
