import { nanoid } from 'nanoid'
import { ServerWebAppConfig } from '@mss/web/webAppConfig'
import { s3 } from '@mss/web/server/s3/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

export const createSignedGetUrl = async ({
  key,
}: {
  key: string
}): Promise<{ url: string }> => {
  // Signed URL
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Key: key,
      Bucket: ServerWebAppConfig.S3.uploadsBucketId,
    }),
    {
      expiresIn: 600,
    },
  )
  return { url }
}

export const createSignedUploadUrl = async ({
  directory,
  name,
  type,
}: {
  name: string
  type: string
  directory: string
}): Promise<{ url: string; key: string }> => {
  const key = `${directory}/${nanoid()}_${name}`

  // Signed URL
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Key: key,
      Bucket: ServerWebAppConfig.S3.uploadsBucketId,
      ContentType: type,
    }),
    { expiresIn: 3600 },
  )
  return { url, key }
}
