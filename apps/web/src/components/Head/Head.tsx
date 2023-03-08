import { PrivateConfig } from '@mss/web/config'
import { Dsfr } from '@mss/web/components/RootLayout/Dsfr'
import { Matomo } from '@mss/web/components/RootLayout/Matomo'
import { headers } from 'next/headers'

const fontsToPreload = ['Marianne-Regular', 'Marianne-Bold', 'Marianne-Medium']

export const Head = () => {
  const nonce = headers().get('x-mss-script-nonce') ?? undefined

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {PrivateConfig.isMain ? null : (
        // Do not index preview environments
        <meta name="robots" content="noindex" />
      )}
      <title>Mon Suivi Social</title>
      <meta name="theme-color" content="#000091" />
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
      <meta name="description" content="Mon Suivi Social" />
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
