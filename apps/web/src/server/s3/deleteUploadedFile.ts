import { s3 } from '@mss/web/server/s3/s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { PrivateConfig } from '@mss/web/config'

export const deleteUploadedFile = ({ key }: { key: string }) =>
  s3.send(
    new DeleteObjectCommand({
      Key: key,
      Bucket: PrivateConfig.S3.uploadsBucketId,
    }),
  )
