'use client'

import { useEffect } from 'react'
import { isBrowser } from '@mss/web/utils/isBrowser'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'

// Insert this component to trigger a smooth scroll to a support item card (followup or help request)
export function ScrollToSupportItem({ item }: { item?: string }) {
  useEffect(() => {
    if (!item || !isBrowser) {
      return
    }
    const element = document.getElementById(item)

    if (!element) {
      return
    }

    smoothScrollIntoView(element, {
      scrollMode: 'always',
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [item])

  return null
}
