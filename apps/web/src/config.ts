const NodeEnv = process.env.NODE_ENV

const emailServer = `smtp://${process.env.SMTP_USERNAME}:${process.env.SCW_SECRET_KEY}@${process.env.SMTP_SERVER}:${process.env.SMTP_PORT}`

export const PrivateConfig = {
  NodeEnv,
  Branch: process.env.BRANCH ?? '',
  Namespace: process.env.NAMESPACE ?? '',
  isMain: process.env.BRANCH === 'main',
  Chromatic: {
    appId: process.env.CHROMATIC_APP_ID ?? '',
  },
  Auth: {
    Email: {
      server: emailServer,
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    },
  },
  Grist: {
    apiKey: process.env.GRIST_API_KEY ?? '',
    documentId: process.env.GRIST_DOCUMENT_ID ?? '',
    tableId: process.env.GRIST_TABLE_ID ?? '',
  },
  S3: {
    host: process.env.SCW_S3_HOST ?? '',
    bucketId: `${process.env.SCW_BUCKET_ID}`,
    bucketLocation: process.env.SCW_S3_BUCKET_LOCATION ?? '',
    accessKey: process.env.SCW_ACCESS_KEY ?? '',
    secretKey: process.env.SCW_SECRET_KEY ?? '',
  },
  Insee: {
    sirenAccessToken: process.env.SIREN_ACCESS_TOKEN,
  },
  InclusionConnect: {
    realm: process.env.INCLUSION_CONNECT_REALM ?? '',
    baseUrl: process.env.INCLUSION_CONNECT_BASE_URL ?? '',
    clientId: process.env.INCLUSION_CONNECT_CLIENT_ID ?? '',
    clientSecret: process.env.INCLUSION_CONNECT_CLIENT_SECRET ?? '',
    issuer: process.env.INCLUSION_CONNECT_ISSUER ?? '',
    from: 'monsuivisocial',
  },
}

export const PublicConfig = {
  productTitle: 'Mon Suivi Social',
  mainLiveUrl: 'https://v2.monsuivisocial.incubateur.anct.gouv.fr',
  repository: 'https://github.com/inclusion-numerique/mon-suivi-social',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  sirenApiKey: process.env.NEXT_PUBLIC_SIREN_API_KEY ?? '',
}
