import { SessionUser } from '@mss/web/auth/sessionUser'
import PublicHeader from '@mss/web/app/(public)/PublicHeader'
import { Routes } from '@mss/web/app/routing/routes'
import { UserMenu } from '@mss/web/app/(private)/UserMenu'

const PrivateHeader = ({ user }: { user: SessionUser }) => {
  const helpItem = (
    <li>
      <a
        className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-question-line"
        target="_blank"
        rel="noreferrer"
        href="https://mon-suivi-social.gitbook.io/mon-suivi-social/"
      >
        Aide
      </a>
    </li>
  )
  const userMenuItem = (
    <li>
      <UserMenu user={user} />
    </li>
  )

  const logoutItem = (
    <li>
      <a
        href={Routes.Connexion.Logout}
        className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-logout-box-r-line"
      >
        Se déconnecter
      </a>
    </li>
  )

  return (
    <PublicHeader
      fullWidth
      hideRepublic
      rootPath={Routes.Index.path}
      headerTools={
        <div className="fr-header__tools">
          <div className="fr-header__tools-links">
            <ul className="fr-links-group">
              {helpItem}
              {userMenuItem}
              {logoutItem}
            </ul>
          </div>
        </div>
      }
      mobileMenuLinks={
        <div className="fr-header__menu-links">
          <ul className="fr-btns-group">
            {helpItem}
            {userMenuItem}
            {logoutItem}
          </ul>
        </div>
      }
    />
  )
}

export default PrivateHeader
