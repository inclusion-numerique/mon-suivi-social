'use client'

import { isBrowser } from '@mss/web/utils/isBrowser'
import { initializeSentry } from '@mss/web/sentry'

export const BrowserSentryInit = () => {
  if (!isBrowser || process.env.NODE_ENV !== 'production') {
    return null
  }
  initializeSentry()

  return null
}
