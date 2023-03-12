import { nanoid } from 'nanoid'
import { ServerWebAppConfig } from '@mss/web/webAppConfig'
import { s3 } from '@mss/web/server/s3/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

export const createSignedGetUrl = async ({
  key,
  bucket,
}: {
  key: string
  bucket: string
}): Promise<{ url: string }> => {
  // Signed URL
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Key: key,
      Bucket: bucket,
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
  bucket,
}: {
  name: string
  type: string
  directory: string
  bucket: string
}): Promise<{ url: string; key: string }> => {
  const key = `${directory}/${nanoid()}_${name}`

  // Signed URL
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Key: key,
      Bucket: bucket,
      ContentType: type,
    }),
    { expiresIn: 3600 },
  )
  return { url, key }
}
