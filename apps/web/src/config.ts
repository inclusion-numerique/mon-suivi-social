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
    region: process.env.SCW_DEFAULT_REGION ?? '',
    bucketId: `${process.env.SCW_BUCKET_ID}`,
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

export const PublicConfig = {
  productTitle: 'Mon Suivi Social',
  mainLiveUrl: 'https://v2.monsuivisocial.incubateur.anct.gouv.fr',
  repository: 'https://github.com/inclusion-numerique/mon-suivi-social',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  sirenApiKey: process.env.NEXT_PUBLIC_SIREN_API_KEY ?? '',

  InclusionConnect: {
    issuer: process.env.NEXT_PUBLIC_INCLUSION_CONNECT_ISSUER ?? '',
    clientId: process.env.NEXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID ?? '',
    from: 'monsuivisocial',
  },
}
