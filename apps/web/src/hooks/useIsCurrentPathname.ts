import { usePathname } from 'next/navigation'

export const useIsCurrentPathname = () => {
  const pathName = usePathname() ?? '/'

  return (path: string) => pathName.startsWith(path)
}
