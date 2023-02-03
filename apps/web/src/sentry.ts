import { PublicConfig } from '@mss/web/config'
import * as Sentry from '@sentry/nextjs'

export const initializeSentry = () => {
  if (!PublicConfig.Sentry.dsn) {
    return
  }

  Sentry.init({
    dsn: PublicConfig.Sentry.dsn,
    environment: PublicConfig.Sentry.environment,
    tracesSampleRate: 1.0,
  })
}