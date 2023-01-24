import Link from 'next/link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import PublicHeader from '@mss/web/app/(public)/PublicHeader'
import { Routes } from '@mss/web/app/routing/routes'
import { UserMenu } from '@mss/web/app/structure/UserMenu'

const PrivateHeader = ({ user }: { user: SessionUser }) => {
  return (
    <PublicHeader
      fullWidth
      hideRepublic
      rootPath={Routes.Structure.Index.path}
      headerTools={
        <div className="fr-header__tools">
          <div className="fr-header__tools-links">
            <ul className="fr-links-group">
              <li>
                <UserMenu user={user} />
              </li>
              <li>
                <Link
                  href={Routes.Connexion.Logout}
                  target="_self"
                  className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-logout-box-r-line"
                >
                  Se déconnecter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      }
      mobileMenuLinks={
        <div className="fr-header__menu-links">
          <ul className="fr-btns-group">
            <li>
              <UserMenu user={user} />
            </li>
            <li>
              <a
                href={Routes.Connexion.Logout}
                className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-logout-box-r-line"
              >
                Se déconnecter
              </a>
            </li>
          </ul>
        </div>
      }
    />
  )
}

export default PrivateHeader
