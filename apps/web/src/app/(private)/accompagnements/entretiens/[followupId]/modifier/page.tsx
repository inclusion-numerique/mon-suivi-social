import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { prismaClient } from '@mss/web/prismaClient'
import { EditFollowupServer } from '@mss/web/features/followup/editFollowup.server'
import { FollowupForm } from '@mss/web/components/FollowupForm/FollowupForm'
import { getStructureFollowupTypes } from '@mss/web/service/StructureService'
import { Options } from '@mss/web/utils/options'
import {
  canViewBeneficiaryFollowupPrivateSynthesis,
  canViewBeneficiaryFollowupSynthesis,
} from '@mss/web/security/rules'

export const revalidate = 0

const EditFollowupPage = async ({
  params: { followupId },
}: {
  params: RoutePathParams<typeof Routes.Accompagnements.Entretien.Modifier.path>
}) => {
  const user = await getAuthenticatedAgent()
  const followup = await prismaClient.followup.findFirst({
    where: {
      id: followupId,
    },
    select: {
      createdById: true,
      structureId: true,
      beneficiary: {
        select: {
          ...beneficiarySecurityTargetSelect,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          fileNumber: true,
          documents: {
            select: { key: true, type: true, name: true },
          },
        },
      },
    },
  })

  if (!followup) {
    notFound()
    return null
  }

  if (
    !EditFollowupClient.securityCheck(user, followup.beneficiary, {
      createdById: followup.createdById,
    })
  ) {
    notFound()
    return null
  }

  const followupTypes = await getStructureFollowupTypes({
    structureId: followup.structureId,
  })
  const followupTypeOptions: Options = followupTypes.map(
    ({ followupType: { name, id } }) => ({
      name,
      value: id,
    }),
  )
  const documentOptions: Options = followup.beneficiary.documents.map(
    ({ name, type, key }) => ({ name: `${type} - ${name}`, value: key }),
  )

  const canViewSynthesis = canViewBeneficiaryFollowupSynthesis(
    user,
    followup.beneficiary,
    followup,
  )
  const canViewPrivateSynthesis = canViewBeneficiaryFollowupPrivateSynthesis(
    user,
    followup.beneficiary,
    followup,
  )
  const serverState = await EditFollowupServer.getServerState({
    followupId,
    includeSynthesis: canViewSynthesis,
    includePrivateSynthesis: canViewPrivateSynthesis,
  })
  const defaultInput = EditFollowupServer.dataFromServerState(serverState)

  const page: PageConfig = {
    ...Routes.Accompagnements.Entretien.Modifier,
    title: Routes.Accompagnements.Entretien.Modifier.title(
      followup.beneficiary,
    ),
  }

  return (
    <>
      <PageTitle page={page} parents={[Routes.Accompagnements.Index]} />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <FollowupForm
                followupTypeOptions={followupTypeOptions}
                documentOptions={documentOptions}
                synthesisField={canViewSynthesis}
                privateSynthesisField={canViewPrivateSynthesis}
                defaultInput={serialize(defaultInput)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default EditFollowupPage
