import Script from 'next/script'

export const Matomo = ({ nonce }: { nonce?: string }) =>
  process.env.NODE_ENV === 'production' ? (
    <Script nonce={nonce} src="/matomo/matomo.min.js" strategy="lazyOnload" />
  ) : null
