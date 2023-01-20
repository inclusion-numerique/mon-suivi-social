'use client'

import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'

// Wrap your component or third party component that should only load on the browser (e.g useLayoutEffect()) with this
export const BrowserOnly = ({
  children,
  placeholder,
}: PropsWithChildren<{ placeholder?: ReactNode }>) => {
  const [show, setShow] = useState(false)

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) {
    return <>{placeholder}</> ?? null
  }

  return <>{children}</>
}
