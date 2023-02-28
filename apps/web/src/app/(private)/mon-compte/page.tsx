import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { getAuthenticatedSessionUser } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import {
  getInclusionConnectChangePasswordUrl,
  getInclusionConnectLogoutUrl,
  inclusionConnectProviderId,
} from '@mss/web/auth/inclusionConnect'
import Link from 'next/link'
import { Card } from '@mss/web/ui/Card'
import { Routes } from '@mss/web/app/routing/routes'

const MonComptePage = async () => {
  const user = await getAuthenticatedSessionUser()
  const inclusionConnectAccount = await prismaClient.account.findFirst({
    where: { userId: user.id, provider: inclusionConnectProviderId },
  })

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
              {/*  rel="noreferrer" */}
              {/*  style={{ margin: '0 auto 0 0' }} */}
              {/* > */}
              {/*  Voir mon profil Inclusion Connect */}
              {/* </Link> */}
              {/* <br /> */}
              <Link
                className="fr-link"
                href={getInclusionConnectChangePasswordUrl()}
                target="_blank"
                rel="noreferrer"
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
                rel="noreferrer"
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
