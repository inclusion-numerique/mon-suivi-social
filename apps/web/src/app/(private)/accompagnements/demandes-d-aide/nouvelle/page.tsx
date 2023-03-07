import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/components/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { notFound } from 'next/navigation'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'
import { Options } from '@mss/web/utils/options'
import { HelpRequestForm } from '@mss/web/components/HelpRequestForm/HelpRequestForm'
import { AccompagnementsBusiness } from '@mss/web/business'

export const revalidate = 0

const AddHelpRequestPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Accompagnements.DemandeDAide.Nouvelle.path
  >
}) => {
  if (!searchParams) {
    notFound()
  }
  const user = await getAuthenticatedAgent()
  const beneficiary = await AccompagnementsBusiness.getBeneficiary(
    searchParams.dossier,
  )

  if (!beneficiary) {
    notFound()
  }

  if (!AddHelpRequestClient.securityCheck(user, beneficiary, {})) {
    notFound()
  }

  const followupTypes = await AccompagnementsBusiness.getStructureFollowupTypes(
    {
      structureId: beneficiary.structureId,
    },
  )
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
          ...Routes.Accompagnements.DemandeDAide.Nouvelle,
          title:
            Routes.Accompagnements.DemandeDAide.Nouvelle.title(beneficiary),
        }}
        parents={[Routes.Accompagnements.Index]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <HelpRequestForm
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
export default AddHelpRequestPage
