import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { notFound } from 'next/navigation'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import { serialize } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'
import { BeneficiaryArchiveForm } from '@mss/web/components/BeneficiaryArchiveForm'
import { BeneficiaryQuery } from '@mss/web/data'

export const revalidate = 0

const EditBeneficiaryPage = async ({
  params: { fileNumber },
}: {
  params: { fileNumber?: string }
}) => {
  if (!fileNumber) {
    return notFound()
  }

  const user = await getAuthenticatedAgent()
  const beneficiary = await BeneficiaryQuery.findByFileNumber(fileNumber)

  if (!beneficiary || beneficiary.structureId != user.structureId) {
    return notFound()
  }

  const page: PageConfig = {
    ...Routes.Beneficiaires.Beneficiaire.Archiver,
    title: Routes.Beneficiaires.Beneficiaire.Archiver.title(beneficiary),
  }

  return (
    <>
      <PageTitle
        page={page}
        parents={[
          Routes.Beneficiaires.Index,
          {
            title: Routes.Beneficiaires.Beneficiaire.Index.title(beneficiary),
            path: Routes.Beneficiaires.Beneficiaire.Index.path({
              fileNumber,
            }),
          },
        ]}
      />
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <BeneficiaryArchiveForm
              serializedBeneficiary={serialize(beneficiary)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default EditBeneficiaryPage
