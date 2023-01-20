import { usePathname } from 'next/navigation'

export const useIsCurrentPathname = () => {
  const pathName = usePathname() ?? '/'

  return (path: string, exact?: boolean) =>
    exact ? pathName === path : pathName.startsWith(path)
}
