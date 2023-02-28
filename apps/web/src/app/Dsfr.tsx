'use client'

import Script from 'next/script'

export function Dsfr() {
  return <Script src="/dsfr/dsfr.module.min.js" strategy="lazyOnload" />
}
