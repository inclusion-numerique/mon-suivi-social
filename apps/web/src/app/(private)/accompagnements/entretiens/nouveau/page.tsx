import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { notFound } from 'next/navigation'
import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { FollowupForm } from '@mss/web/app/(private)/accompagnements/entretiens/FollowupForm'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'
import { getStructureFollowupTypes } from '@mss/web/structure/getStructureFollowupTypes'
import { Options } from '@mss/web/utils/options'
import { prismaClient } from '@mss/web/prismaClient'

export const revalidate = 0

const AddFollowupPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Accompagnements.Entretien.Nouveau.path
  >
}) => {
  if (!searchParams) {
    notFound()
    return null
  }
  const user = await getAuthenticatedAgent()
  const beneficiary = await prismaClient.beneficiary.findFirst({
    where: {
      fileNumber: searchParams.dossier,
    },
    select: {
      ...beneficiarySecurityTargetSelect,
      firstName: true,
      birthName: true,
      usualName: true,
      fileNumber: true,
      email: true,
      documents: {
        select: { key: true, type: true, name: true },
      },
    },
  })

  if (!beneficiary) {
    notFound()
    return null
  }

  if (!AddFollowupClient.securityCheck(user, beneficiary, {})) {
    notFound()
    return null
  }

  const followupTypes = await getStructureFollowupTypes({
    structureId: beneficiary.structureId,
  })
  const followupTypeOptions: Options = followupTypes.map(
    ({ followupType: { name, id } }) => ({
      name,
      value: id,
    }),
  )

  const documentOptions: Options = beneficiary.documents.map(
    ({ name, type, key }) => ({ name: `${type} - ${name}`, value: key }),
  )

  return (
    <>
      <PageTitle
        page={{
          ...Routes.Accompagnements.Entretien.Nouveau,
          title: Routes.Accompagnements.Entretien.Nouveau.title(beneficiary),
        }}
        parents={[Routes.Accompagnements.Index]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <FollowupForm
                creation
                followupTypeOptions={followupTypeOptions}
                documentOptions={documentOptions}
                defaultInput={{ beneficiaryId: beneficiary.id }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AddFollowupPage
