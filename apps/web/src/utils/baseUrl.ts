import { isBrowser } from '@mss/web/utils/isBrowser'

export const getServerBaseUrl = () => {
  if (isBrowser) {
    // browser should use relative path
    return ''
  }
  if (process.env.BASE_URL) {
    return `https://${process.env.BASE_URL}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const getUrl = (path: string) => `${getServerBaseUrl()}${path}`
