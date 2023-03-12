import { s3 } from '@mss/web/server/s3/s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { ServerWebAppConfig } from '@mss/web/webAppConfig'

export const deleteUploadedFile = ({ key }: { key: string }) =>
  s3.send(
    new DeleteObjectCommand({
      Key: key,
      Bucket: ServerWebAppConfig.S3.documentsBucketId,
    }),
  )
