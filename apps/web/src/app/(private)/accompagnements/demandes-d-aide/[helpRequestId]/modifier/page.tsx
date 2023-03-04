import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { prismaClient } from '@mss/web/prismaClient'
import { HelpRequestForm } from '@mss/web/components/HelpRequestForm'
import { getStructureFollowupTypes } from '@mss/web/data/getStructureFollowupTypes'
import { Options } from '@mss/web/utils/options'
import {
  canViewBeneficiaryHelpRequestPrivateSynthesis,
  canViewBeneficiaryHelpRequestSynthesis,
} from '@mss/web/security/rules'
import { EditHelpRequestServer } from '@mss/web/features/helpRequest/editHelpRequest.server'

export const revalidate = 0

const EditHelpRequestPage = async ({
  params: { helpRequestId },
}: {
  params: RoutePathParams<
    typeof Routes.Accompagnements.DemandeDAide.Modifier.path
  >
}) => {
  const user = await getAuthenticatedAgent()
  const helpRequest = await prismaClient.helpRequest.findFirst({
    where: {
      id: helpRequestId,
    },
    select: {
      structureId: true,
      createdById: true,
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

  if (!helpRequest) {
    notFound()
    return null
  }

  if (
    !EditHelpRequestClient.securityCheck(user, helpRequest.beneficiary, {
      createdById: helpRequest.createdById,
    })
  ) {
    notFound()
    return null
  }

  const followupTypes = await getStructureFollowupTypes({
    structureId: helpRequest.structureId,
  })
  const followupTypeOptions: Options = followupTypes.map(
    ({ followupType: { name, id } }) => ({
      name,
      value: id,
    }),
  )
  const documentOptions: Options = helpRequest.beneficiary.documents.map(
    ({ name, type, key }) => ({ name: `${type} - ${name}`, value: key }),
  )

  const page: PageConfig = {
    ...Routes.Accompagnements.DemandeDAide.Modifier,
    title: Routes.Accompagnements.DemandeDAide.Modifier.title(
      helpRequest.beneficiary,
    ),
  }

  const canViewSynthesis = canViewBeneficiaryHelpRequestSynthesis(
    user,
    helpRequest.beneficiary,
    helpRequest,
  )
  const canViewPrivateSynthesis = canViewBeneficiaryHelpRequestPrivateSynthesis(
    user,
    helpRequest.beneficiary,
    helpRequest,
  )
  const serverState = await EditHelpRequestServer.getServerState({
    helpRequestId,
    includeSynthesis: canViewSynthesis,
    includePrivateSynthesis: canViewPrivateSynthesis,
  })
  const defaultInput = EditHelpRequestServer.dataFromServerState(serverState)

  return (
    <>
      <PageTitle page={page} parents={[Routes.Accompagnements.Index]} />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <HelpRequestForm
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
export default EditHelpRequestPage
