import '@mss/web/styles/app.css'
import { PropsWithChildren } from 'react'
import { Matomo } from '@mss/web/app/Matomo'
import { Dsfr } from '@mss/web/app/Dsfr'
import { EnvironmentInformation } from '@mss/web/app/EnvironmentInformation'
import { BrowserSentryInit } from '@mss/web/app/BrowserSentryInit'

const fontsToPreload = ['Marianne-Regular', 'Marianne-Bold', 'Marianne-Medium']

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr" data-fr-theme="light" data-fr-scheme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <Dsfr />
        <Matomo />
        <BrowserSentryInit />
      </head>
      <body>
        <EnvironmentInformation />
        {children}
      </body>
    </html>
  )
}
