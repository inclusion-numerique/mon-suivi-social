import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getAgentOptions } from '@mss/web/app/(private)/beneficiaires/getAgentOptions'
import { notFound } from 'next/navigation'
import { prismaClient } from '@mss/web/prismaClient'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { serialize } from '@mss/web/utils/serialization'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { BeneficiaryForm } from '@mss/web/beneficiary/BeneficiaryForm'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import { EditBeneficiaryGeneralInfoServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.server'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'

export const revalidate = 0

const EditBeneficiaryPage = async ({
  params: { fileNumber },
}: {
  params: RoutePathParams<
    typeof Routes.Beneficiaires.Beneficiaire.Modifier.path
  >
}) => {
  const user = await getAuthenticatedAgent()

  // TODO put this in feature file
  // TODO Put this kind of data for structure followup in feature file and NOT in server state as it has no impact on mutation diff
  const beneficiary = await prismaClient.beneficiary.findFirst({
    where: { fileNumber, archived: null },
    select: {
      ...beneficiarySecurityTargetSelect,
      fileNumber: true,
      firstName: true,
      birthName: true,
      usualName: true,
      email: true,
    },
  })
  if (!beneficiary) {
    return notFound()
  }

  if (!EditBeneficiaryGeneralInfoClient.securityCheck(user, beneficiary, {})) {
    notFound()
    return null
  }

  const full = EditBeneficiaryFullDataClient.securityCheck(
    user,
    beneficiary,
    {},
  )

  const agents = await getAgentOptions(user)

  const serverState = await EditBeneficiaryGeneralInfoServer.getServerState({
    beneficiaryId: beneficiary.id,
  })
  const defaultInput =
    EditBeneficiaryGeneralInfoServer.dataFromServerState(serverState)

  const page: PageConfig = {
    ...Routes.Beneficiaires.Beneficiaire.Modifier,
    title: Routes.Beneficiaires.Beneficiaire.Modifier.title(beneficiary),
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
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <BeneficiaryForm
                full={full}
                agents={agents}
                defaultInput={serialize(defaultInput)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default EditBeneficiaryPage
