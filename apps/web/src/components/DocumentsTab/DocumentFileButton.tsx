'use client'

import { trpc } from '@mss/web/trpc'
import { withTrpc } from '@mss/web/components/TrpcProvider'
import Downloader from 'js-file-downloader'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Document } from '@prisma/client'
import { documentTypeLabels } from '@mss/web/client/options/document'

export const DocumentFileButton = withTrpc(
  ({
    serializedDocument,
    download,
  }: {
    serializedDocument: Serialized<Document>
    download?: boolean
  }) => {
    const document = deserialize(serializedDocument)
    const title = download ? 'Télécharger' : 'Voir'
    const icon = download ? 'fr-icon-download-line' : 'fr-icon-eye-line'

    const createLink = trpc.beneficiary.document.createViewUrl.useMutation()

    const onClick = async () => {
      const { url } = await createLink.mutateAsync({ key: document.key })

      if (download) {
        const filename = `MSS - ${documentTypeLabels[document.type]} - ${
          document.name
        }`
        new Downloader({ url, autoStart: true, filename })
        return
      }
      window.open(url, '_blank')?.focus()
    }

    return (
      <div className="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left">
        <button
          onClick={onClick}
          type="button"
          className={`fr-btn fr-btn--tertiary ${icon}`}
        >
          {title}
        </button>
      </div>
    )
  },
)
