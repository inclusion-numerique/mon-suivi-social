import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getAgentOptions } from '@mss/web/app/(private)/beneficiaires/getAgentOptions'
import { notFound } from 'next/navigation'
import { prismaClient } from '@mss/web/prismaClient'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { serialize } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'
import { BeneficiaryForm } from '@mss/web/beneficiary/BeneficiaryForm'
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
    ...Routes.Structure.Beneficiaires.Beneficiaire.Archiver,
    title:
      Routes.Structure.Beneficiaires.Beneficiaire.Archiver.title(beneficiary),
  }

  return (
    <>
      <PageTitle
        page={page}
        parents={[
          Routes.Structure.Beneficiaires.Index,
          {
            title:
              Routes.Structure.Beneficiaires.Beneficiaire.Index.title(
                beneficiary,
              ),
            path: Routes.Structure.Beneficiaires.Beneficiaire.Index.path({
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
