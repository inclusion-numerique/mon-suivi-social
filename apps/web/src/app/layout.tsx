import { RootLayout } from '@mss/web/components/RootLayout'
import { ServerWebAppConfig, PublicWebAppConfig } from '@mss/web/webAppConfig'

const defaultExport = RootLayout

export function generateMetadata() {
  return {
    themeColor: '#000091',
    charSet: 'utf8',
    viewport: 'width=device-width, initial-scale=1',
    robot: ServerWebAppConfig.isMain ? null : 'noindex',
    description: PublicWebAppConfig.projectTitle,
    title: PublicWebAppConfig.projectTitle,
  }
}

export default defaultExport
