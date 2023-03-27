import { ServerWebAppConfig, PublicWebAppConfig } from '@mss/web/webAppConfig'
import { Dsfr } from './Dsfr'
import { Matomo } from './Matomo'
import { headers } from 'next/headers'

const fontsToPreload = ['Marianne-Regular', 'Marianne-Bold', 'Marianne-Medium']

export const Head = () => {
  const nonce = headers().get('x-mss-script-nonce') ?? undefined

  return (
    <>
      <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
      <link
        rel="shortcut icon"
        href="/favicon/favicon.ico"
        type="image/x-icon"
      />
      <link
        rel="manifest"
        href="/favicon/manifest.webmanifest"
        crossOrigin="use-credentials"
      />

      <link rel="icon" href="/favicon.ico" />
      {fontsToPreload.map((font) => (
        <link
          key={font}
          rel="preload"
          crossOrigin="anonymous"
          href={`/dsfr/fonts/${font}.woff2`}
          as="font"
          type="font/woff2"
        />
      ))}
      <Dsfr nonce={nonce} />
      <Matomo nonce={nonce} />
    </>
  )
}
