import type { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '@mss/web/prismaClient'
import { PublicConfig } from '@mss/web/config'

const dbStatus = () =>
  prismaClient.$queryRaw`SELECT 1`
    .then(() => ({ status: 'ok' }))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    .catch((error) => ({ status: 'error', error }))

const sentryStatus = PublicConfig.Sentry.dsn
  ? {
      enabled: true,
      environment: PublicConfig.Sentry.environment,
    }
  : { enabled: false }

export default async function health(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const database = await dbStatus()
  const status = database.status
  const headers = req.headers
  const host = req.headers.host
  const containerImage = process.env.MSS_WEB_IMAGE

  res.status(status === 'ok' ? 200 : 503).json({
    status,
    database,
    headers,
    host,
    containerImage,
    sentry: sentryStatus,
  })
}
