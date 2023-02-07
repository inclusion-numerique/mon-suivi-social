import BeneficiariesSearchBar from '@mss/web/app/(private)/beneficiaires/BeneficiariesSearchBar'
import Link from 'next/link'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
import { getSessionUser } from '@mss/web/auth/getSessionUser'

const TableauDeBordPage = async () => {
  const user = await getSessionUser()
  return (
    <>
      <PageTitle page={Routes.Structure.Index} />
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div
              className="fr-grid-row fr-grid-row--gutters"
              style={{ display: 'flex' }}
            >
              <div className="fr-col-12 fr-col-md-8">
                <BeneficiariesSearchBar structureId={user?.structureId} />
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
