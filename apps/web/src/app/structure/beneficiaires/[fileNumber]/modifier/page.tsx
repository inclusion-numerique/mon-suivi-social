import BeneficiaryForm from '@mss/web/beneficiary/BeneficiaryForm'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getAgentOptions } from '@mss/web/app/structure/beneficiaires/getAgentOptions'
import { notFound } from 'next/navigation'
import { prismaClient } from '@mss/web/prismaClient'
import { PageConfig, PageTitle } from '@mss/web/app/structure/PageTitle'
import { serialize } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'

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
  const agents = await getAgentOptions(user)
  const beneficiary = await prismaClient.beneficiary.findUnique({
    where: { fileNumber },
  })

  if (!beneficiary || beneficiary.organisationId != user.organisationId) {
    return notFound()
  }

  const page: PageConfig = {
    ...Routes.Structure.Beneficiaires.Beneficiaire.Modifier,
    title:
      Routes.Structure.Beneficiaires.Beneficiaire.Modifier.title(beneficiary),
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
            <BeneficiaryForm
              agents={agents}
              serializedBeneficiary={serialize(beneficiary)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default EditBeneficiaryPage
