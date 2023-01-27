import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getAgentOptions } from '@mss/web/app/structure/beneficiaires/getAgentOptions'
import { Routes } from '@mss/web/app/routing/routes'
import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { BeneficiaryForm } from '@mss/web/beneficiary/BeneficiaryForm'

const AddBeneficiaryPage = async () => {
  const user = await getAuthenticatedAgent()
  const agents = await getAgentOptions(user)

  return (
    <>
      <PageTitle
        page={Routes.Structure.Beneficiaires.Nouveau}
        parents={[Routes.Structure.Beneficiaires.Index]}
      />
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <BeneficiaryForm
              agents={agents}
              creation
              defaultValues={{ organisationId: user.organisationId }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default AddBeneficiaryPage
