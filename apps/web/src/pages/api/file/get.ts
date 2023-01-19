import { NextApiRequest, NextApiResponse } from 'next'
import { createSignedGetUrl } from '@mss/web/server/createSignedUrl'

export type AttachmentGetApiResponse = { url: string }

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get info from body
    const { key } = req.body

    const { url } = await createSignedGetUrl({
      key,
    })

    res.status(200).json({ url })
  } catch (err) {
    // TODO SENTRY
    console.error(err)
    res.status(400).json({ error: err as string })
  }
}
export default get
