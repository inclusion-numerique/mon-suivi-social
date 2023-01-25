import { S3Client } from '@aws-sdk/client-s3'
import { PrivateConfig } from '@mss/web/config'

export const s3 = new S3Client({
  credentials: {
    accessKeyId: PrivateConfig.S3.accessKey,
    secretAccessKey: PrivateConfig.S3.secretKey,
  },
  region: PrivateConfig.S3.region,
  endpoint: `https://${PrivateConfig.S3.host}`,
})
