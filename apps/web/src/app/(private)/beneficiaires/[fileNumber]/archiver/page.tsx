import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { notFound } from 'next/navigation'
import { prismaClient } from '@mss/web/prismaClient'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { serialize } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'
import { ArchiveBeneficiaryForm } from '@mss/web/beneficiary/ArchiveBeneficiaryForm'

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
  const beneficiary = await prismaClient.beneficiary.findUnique({
    where: { fileNumber },
  })

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
            <ArchiveBeneficiaryForm
              serializedBeneficiary={serialize(beneficiary)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default EditBeneficiaryPage
