import { useEffect } from 'react'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'
import { trpc } from '@mss/web/trpc'
import { Spinner } from '@mss/web/ui/Spinner'

export const DocumentViewer = ({
  key,
  name,
}: {
  key: string
  type: string
  name: string
}) => {
  const viewUrl = trpc.beneficiary.document.createViewUrl.useMutation()

  useEffect(() => {
    viewUrl.mutate({ key })
  }, [key, viewUrl])

  if (!viewUrl.isSuccess) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  // TODO button to download asset and button to Open asset in new tab
  return (
    <div>
      <a href={viewUrl.data.url} target="_blank" rel="noreferrer">
        {name}
      </a>
    </div>
  )
}
