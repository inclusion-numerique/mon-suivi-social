import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { EditFollowupServer } from '@mss/web/features/followup/editFollowup.server'
import { FollowupFormEdition } from '@mss/web/components/FollowupForm'
import { Options } from '@mss/web/utils/options'
import {
  canViewBeneficiaryFollowupPrivateSynthesis,
  canViewBeneficiaryFollowupSynthesis,
} from '@mss/web/security/rules'
import { AccompagnementsQuery } from '@mss/web/server/query'

export const revalidate = 0

const EditFollowupPage = async ({
  params: { followupId },
}: {
  params: RoutePathParams<typeof Routes.Accompagnements.Entretien.Modifier.path>
}) => {
  const user = await getAuthenticatedAgent()
  const followup = await AccompagnementsQuery.getFollowup(followupId)

  if (!followup) {
    notFound()
  }

  if (
    !EditFollowupClient.securityCheck(user, followup.beneficiary, {
      createdById: followup.createdById,
    })
  ) {
    notFound()
  }

  const followupTypes = await AccompagnementsQuery.getStructureFollowupTypes({
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
              <FollowupFormEdition
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
