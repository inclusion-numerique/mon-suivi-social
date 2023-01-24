import Link from 'next/link'
import BeneficiariesSearchBar from '@mss/web/app/structure/beneficiaires/BeneficiariesSearchBar'
import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'

const BeneficiariesPage = async () => {
  const user = await getAuthenticatedAgent()

  return (
    <>
      <PageTitle
        icon="user-line"
        title="Bénéficiaires"
        organisationName={user.organisation.name}
      />
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div
              className="fr-grid-row fr-grid-row--gutters"
              style={{ display: 'flex' }}
            >
              <div className="fr-col-12 fr-col-md-8">
                <BeneficiariesSearchBar />
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-btns-group fr-btns-group--icon-left">
                  <Link
                    className="fr-btn fr-icon-user-add-line fr-mb-0"
                    href={Routes.Structure.Beneficiaire.Nouveau}
                  >
                    Ajouter un·e bénéficiaire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default BeneficiariesPage
