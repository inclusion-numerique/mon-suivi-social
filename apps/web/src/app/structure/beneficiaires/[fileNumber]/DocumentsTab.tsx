import { SessionUser } from '@mss/web/auth/sessionUser'
import {
  BeneficiaryPageDocuments,
  BeneficiaryPageInfo,
} from '@mss/web/app/structure/beneficiaires/[fileNumber]/page'
import { AddDocumentButton } from '@mss/web/app/structure/beneficiaires/[fileNumber]/AddDocumentButton'

export const DocumentsTab = ({
  user,
  documents,
  beneficiary,
}: {
  user: SessionUser
  documents: BeneficiaryPageDocuments
  beneficiary: Pick<BeneficiaryPageInfo, 'id'>
}) => {
  return (
    <>
      <h4>Documents</h4>
      <p>Aucun document disponible</p>
      <AddDocumentButton beneficiaryId={beneficiary.id} />
    </>
  )
}
