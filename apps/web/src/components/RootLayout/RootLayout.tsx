import '@mss/web/client/styles/app.scss'
import { PropsWithChildren } from 'react'
import { EnvInformation } from './EnvInformation'

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr" data-fr-theme="light" data-fr-scheme="light">
      <body>
        <EnvInformation />
        {children}
      </body>
    </html>
  )
}
