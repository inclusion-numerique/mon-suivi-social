'use client'

import * as navigation from 'next/navigation'

export const useIsCurrentPathname = () => {
  const pathName =
    // TODO This is an error in typings of next/navigation in 13.2, remove this casting when next fix this
    (navigation as unknown as { usePathname: () => string }).usePathname() ??
    '/'

  return (path: string, exact?: boolean) =>
    exact ? pathName === path : pathName.startsWith(path)
}
