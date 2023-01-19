import { nanoid } from 'nanoid'
import { PrivateConfig } from '@mss/web/config'
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
    new GetObjectCommand({ Key: key, Bucket: PrivateConfig.S3.bucketId }),
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
  // TODO current git branch and more info on user
  const key = `${PrivateConfig.NodeEnv}/${directory}/${nanoid()}_${name}`

  // Signed URL
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Key: key,
      Bucket: PrivateConfig.S3.bucketId,
      ContentType: type,
    }),
    { expiresIn: 3600 },
  )
  return { url, key }
}
