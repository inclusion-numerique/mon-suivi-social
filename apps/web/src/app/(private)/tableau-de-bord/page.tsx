import { PageTitle } from '@mss/web/components/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
import { getSessionUser } from '@mss/web/auth/getSessionUser'
import { BeneficiarySearchBar } from '@mss/web/components/BeneficiarySearchBar'
import { Link } from '@mss/web/components/Generic/Link'

const TableauDeBordPage = async () => {
  const user = await getSessionUser()
  return (
    <>
      <PageTitle page={Routes.Index} />
      {user?.structureId ? (
        <div className="fr-card">
          <div className="fr-card__body">
            <div className="fr-card__content">
              <div
                className="fr-grid-row fr-grid-row--gutters"
                style={{ display: 'flex' }}
              >
                <div className="fr-col-12 fr-col-md-8">
                  <BeneficiarySearchBar structureId={user.structureId} />
                </div>
                <div className="fr-col-12 fr-col-md-4">
                  <div className="fr-btns-group fr-btns-group--icon-left">
                    <Link
                      className="fr-btn fr-icon-user-add-line fr-mb-0"
                      href={Routes.Beneficiaires.Nouveau.path}
                    >
                      Ajouter un·e bénéficiaire
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default TableauDeBordPage
