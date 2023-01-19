import { getServerBaseUrl } from '@mss/web/utils/baseUrl'

// This should be setup before using next auth as url is not available in Paas context in env variables
process.env.NEXTAUTH_URL = getServerBaseUrl()
