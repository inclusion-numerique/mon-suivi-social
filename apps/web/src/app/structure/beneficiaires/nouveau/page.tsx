import BeneficiaryForm from '@mss/web/beneficiary/BeneficiaryForm'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { getAgentOptions } from '@mss/web/app/structure/beneficiaires/getAgentOptions'

const AddBeneficiaryPage = async () => {
  const user = await getAuthenticatedAgent()
  const agents = await getAgentOptions(user)

  return (
    <>
      <div className="fr-grid-row">
        <h2>Ajouter un·e bénéficiaire</h2>
      </div>
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <BeneficiaryForm
              agents={agents}
              creation={true}
              defaultValues={{ organisationId: user.organisationId }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default AddBeneficiaryPage
