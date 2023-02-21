import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { prismaClient } from '@mss/web/prismaClient'
import { EditFollowupServer } from '@mss/web/features/followup/editFollowup.server'
import { FollowupForm } from '@mss/web/app/(private)/accompagnements/entretiens/FollowupForm'

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
      beneficiary: {
        select: {
          ...beneficiarySecurityTargetSelect,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          fileNumber: true,
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

  const serverState = await EditFollowupServer.getServerState({
    followupId,
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
              <FollowupForm defaultInput={serialize(defaultInput)} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default EditFollowupPage
