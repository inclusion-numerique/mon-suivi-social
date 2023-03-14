import { PageTitle } from '@mss/web/components/PageTitle'
import { getAuthenticatedSessionUser } from '@mss/web/auth/getSessionUser'
import {
  getInclusionConnectChangePasswordUrl,
  getInclusionConnectLogoutUrl,
  inclusionConnectProviderId,
} from '@mss/web/auth/inclusionConnect'
import { Link } from '@mss/web/components/Generic/Link'
import { Card } from '@mss/web/components/Generic'
import { Routes } from '@mss/web/app/routing/routes'
import { MonCompteQuery } from '@mss/web/query'

const MonComptePage = async () => {
  const user = await getAuthenticatedSessionUser()
  const inclusionConnectAccount =
    await MonCompteQuery.getInclusionConnectAccount(
      user.id,
      inclusionConnectProviderId,
    )

  return (
    <>
      <PageTitle page={Routes.MonCompte.Index} />
      {inclusionConnectAccount ? (
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12">
            <Card>
              <h4>Inclusion Connect</h4>
              <p>
                Votre compte <strong>{user.email}</strong> est lié à votre
                compte Inclusion Connect.
              </p>
              {/* <Link */}
              {/*  className="fr-link" */}
              {/*  href={getInclusionConnectProfilePageUrl()} */}
              {/*  target="_blank" */}
              {/*  style={{ margin: '0 auto 0 0' }} */}
              {/* > */}
              {/*  Voir mon profil Inclusion Connect */}
              {/* </Link> */}
              {/* <br /> */}
              <Link
                className="fr-link"
                href={getInclusionConnectChangePasswordUrl()}
                target="_blank"
                style={{ margin: '0 auto 0 0' }}
              >
                Changer mon mot de passe
              </Link>
              <br />
              <p className="fr-mt-4v">
                Vous pouvez vous déconnecter de votre compte Inclusion Connect
                en suivant ce lien :
              </p>
              <Link
                className="fr-btn"
                href={getInclusionConnectLogoutUrl()}
                target="_blank"
              >
                Se déconnecter d&apos;Inclusion Connect
              </Link>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default MonComptePage
