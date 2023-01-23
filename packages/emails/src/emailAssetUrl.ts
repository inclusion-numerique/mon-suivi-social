import { getServerBaseUrl } from '@mss/web/utils/baseUrl'

export const emailAssetUrl = (assetPath: string): string => {
  return `${getServerBaseUrl()}/${assetPath}`
}
