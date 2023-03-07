import Script from 'next/script'

export function Matomo() {
  return process.env.NODE_ENV === 'production' ? (
    <Script src="/matomo/matomo.js" strategy="lazyOnload" />
  ) : null
}
