import { mainLiveUrl, projectTitle, repositoryUrl } from '@mss/config/config'

/**
 * Necessary environment variables for web app are listed here.
 */

const NodeEnvironment = process.env.NODE_ENV

const emailServer = `smtp://${process.env.SMTP_USERNAME ?? ''}:${
  process.env.SMTP_PASSWORD ?? ''
}@${process.env.SMTP_SERVER ?? ''}:${process.env.SMTP_PORT ?? ''}`

/**
 * Only use ServerWebAppConfig on server side
 * It contains secrets that must not be sent to the client
 */
export const ServerWebAppConfig = {
  NodeEnv: NodeEnvironment,
  Branch: process.env.BRANCH ?? '',
  Namespace: process.env.NAMESPACE ?? '',
  isMain: process.env.BRANCH === 'main',
  Chromatic: {
    appId: process.env.CHROMATIC_APP_ID ?? '',
  },
  Auth: {
    Email: {
      server: emailServer,
      from: `${process.env.EMAIL_FROM_NAME ?? ''} <${
        process.env.EMAIL_FROM_ADDRESS ?? ''
      }>`,
    },
  },
  S3: {
    documentsBucketId: process.env.DOCUMENTS_BUCKET_ID ?? '',
    host: process.env.SCW_S3_HOST ?? '',
    region: process.env.SCW_DEFAULT_REGION ?? '',
    accessKey: process.env.SCW_ACCESS_KEY ?? '',
    secretKey: process.env.SCW_SECRET_KEY ?? '',
  },
  Insee: {
    sirenAccessToken: process.env.SIREN_ACCESS_TOKEN,
  },
  InclusionConnect: {
    clientSecret: process.env.INCLUSION_CONNECT_CLIENT_SECRET ?? '',
  },
}

/**
 * Public config can be used on client side or server side
 */
export const PublicWebAppConfig = {
  projectTitle,
  mainLiveUrl,
  repository: repositoryUrl,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  sirenApiKey: process.env.NEXT_PUBLIC_SIREN_API_KEY ?? '',

  Sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? '',
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'local',
  },

  InclusionConnect: {
    issuer: process.env.NEXT_PUBLIC_INCLUSION_CONNECT_ISSUER ?? '',
    clientId: process.env.NEXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID ?? '',
  },
}
