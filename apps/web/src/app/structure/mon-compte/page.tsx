import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { getAuthenticatedSessionUser } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import {
  getInclusionConnectLogoutUrl,
  inclusionConnectProviderId,
} from '@mss/web/auth/inclusionConnect'
import Link from 'next/link'

const MonComptePage = async () => {
  const user = await getAuthenticatedSessionUser()
  const inclusionConnectAccount = await prismaClient.account.findFirst({
    where: { userId: user.id, provider: inclusionConnectProviderId },
  })

  return (
    <>
      <PageTitle icon="user-setting-line" title="Mon compte" />
      {inclusionConnectAccount ? (
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12">
            <h4>Inclusion Connect</h4>
            <p>
              Votre compte {user.email} est lié à votre compte Inclusion
              Connect.
            </p>
            <p>
              Vous pouvez vous déconnecter de tout les services utilisant votre
              compte Inclusion Connect :
            </p>

            {/*TODO MSS ALSO LOGOUT ? */}
            <Link
              className="fr-btn fr-btn--icon-left fr-icon-logout-box-r-line"
              href={getInclusionConnectLogoutUrl()}
            >
              Se déconnecter d'Inclusion Connect
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default MonComptePage
