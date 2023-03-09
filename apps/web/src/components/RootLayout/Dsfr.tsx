import Script from 'next/script'

export const Dsfr = ({ nonce }: { nonce?: string }) => (
  <Script nonce={nonce} src="/dsfr/dsfr.module.min.js" strategy="lazyOnload" />
)
