import { NextApiRequest, NextApiResponse } from 'next'
import { createSignedUploadUrl } from '@mss/web/server/createSignedUrl'

export type AttachmentUploadApiResponse = { url: string; key: string }

const upload = async (
  req: NextApiRequest,
  res: NextApiResponse<AttachmentUploadApiResponse | { error: string }>,
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get info from body
    const { name, type, directory } = req.body

    const { url, key } = await createSignedUploadUrl({
      name,
      type,
      directory,
    })

    res.status(200).json({ url, key })
  } catch (err) {
    // TODO SENTRY
    console.error(err)
    res.status(400).json({ error: err as string })
  }
}
export default upload
