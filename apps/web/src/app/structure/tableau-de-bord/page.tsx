import BeneficiariesSearchBar from '@mss/web/app/structure/beneficiaires/BeneficiariesSearchBar'
import Link from 'next/link'

const TableauDeBordPage = () => {
  return (
    <>
      <div className="fr-grid-row">
        <div className="fr-col-12">
          <h2>
            <span className="fr-icon-profil-line fr-icon--lg fr-mr-1w" />
            Tableau de bord
          </h2>
        </div>
      </div>
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
                    href="/beneficiaries/add"
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
export default TableauDeBordPage
