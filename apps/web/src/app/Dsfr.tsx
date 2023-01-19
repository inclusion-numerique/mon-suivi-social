'use client'
import Script from 'next/script'

export const Dsfr = () => (
  <>
    <Script src="/dsfr/dsfr.module.min.js" />
    <Script src="/dsfr/dsfr.nomodule.min.js" noModule={true} />
  </>
)
