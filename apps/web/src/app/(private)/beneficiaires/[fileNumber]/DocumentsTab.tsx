import { SessionUser } from '@mss/web/auth/sessionUser'
import {
  BeneficiaryPageDocuments,
  BeneficiaryPageInfo,
} from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { AddDocumentButton } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/AddDocumentButton'
import { formatByteSize } from '@mss/web/utils/formatByteSize'
import mime from 'mime-types'
import {
  DocumentTag,
  documentTagLabels,
  documentTypeLabels,
} from '@mss/web/features/document/addDocument.client'
import { EditDocumentButton } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/EditDocumentButton'
import { DeleteDocumentButton } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/DeleteDocumentButton'
import { DocumentFileButton } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/DocumentFileButton'
import { serialize } from '@mss/web/utils/serialization'

export const DocumentsTab = ({
  user,
  documents,
  beneficiary,
}: {
  user: SessionUser
  documents: BeneficiaryPageDocuments
  beneficiary: Pick<BeneficiaryPageInfo, 'id'>
}) => {
  if (documents.length === 0) {
    return (
      <>
        <div className="fr-alert fr-alert--info fr-mb-8v">
          <p>Aucun document n&apos;a été ajouté.</p>
        </div>
        <AddDocumentButton beneficiaryId={beneficiary.id} />
      </>
    )
  }

  const documentsByType = new Map<
    BeneficiaryPageDocuments[number]['type'],
    BeneficiaryPageDocuments
  >()
  documents.forEach((document) => {
    const group = documentsByType.get(document.type)
    if (!group) {
      documentsByType.set(document.type, [document])
      return
    }
    group.push(document)
  })

  return (
    <>
      {[...documentsByType.entries()].map(([type, documents], index) => (
        <>
          <h4
            key={type}
            className={`fr-mb-4v ${index === 0 ? '' : 'fr-mt-6v'}`}
          >
            {documentTypeLabels[type]}
          </h4>
          <div className="fr-grid-row fr-grid-row--gutters">
            {documents.map((document) => (
              <DocumentCard key={document.key} document={document} />
            ))}
          </div>
        </>
      ))}
      <AddDocumentButton className="fr-mt-8v" beneficiaryId={beneficiary.id} />
    </>
  )
}

const DocumentCard = ({
  document,
}: {
  document: BeneficiaryPageDocuments[number]
}) => {
  // TODO update
  // TODO delete
  // TODO view
  // TODO Download

  const { key, name, type, size, mimeType, confidential, tags } = document

  const tagLabels = tags
    .filter((tag): tag is DocumentTag => tag in documentTagLabels)
    .map((tag) => documentTagLabels[tag])

  return (
    <div className="fr-col-12 fr-col-lg-6 fr-col-xl-4">
      <div className="fr-card fr-px-4v fr-pt-4v">
        {tags.length === 0 ? null : (
          <ul className="fr-badges-group fr-badges-group--sm">
            {tagLabels.map((tagLabel) => (
              <li key={tagLabel}>
                <p className="fr-badge fr-badge--blue-ecume">{tagLabel}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="fr-mb-0 fr-text--bold">{name}</p>
        <p className="fr-hint-text">
          .{mime.extension(mimeType)} - {formatByteSize(size)}
        </p>
        <div className="fr-grid-row">
          <div className="fr-col-6 fr-pr-1w">
            <EditDocumentButton document={document} />
          </div>
          <div className="fr-col-6 fr-pl-1w">
            <DeleteDocumentButton document={document} />
          </div>
        </div>
        <div className="fr-grid-row">
          <div className="fr-col-6 fr-pr-1w">
            <DocumentFileButton serializedDocument={serialize(document)} />
          </div>
          <div className="fr-col-6 fr-pl-1w">
            <DocumentFileButton
              serializedDocument={serialize(document)}
              download
            />
          </div>
        </div>
      </div>
    </div>
  )
}
