import { SessionUser } from '@mss/web/auth/sessionUser'
import { BeneficiaryPageDocuments } from '@mss/web/app/structure/beneficiaires/[fileNumber]/page'
import { AddDocumentButton } from '@mss/web/app/structure/beneficiaires/[fileNumber]/AddDocumentButton'

export const DocumentsTab = ({
  user,
  documents,
}: {
  user: SessionUser
  documents: BeneficiaryPageDocuments
}) => {
  console.log('DOCUMENTS', documents)
  return (
    <>
      <h4>Documents</h4>
      <p>Aucun document disponible</p>
      <AddDocumentButton />
    </>
  )
}
