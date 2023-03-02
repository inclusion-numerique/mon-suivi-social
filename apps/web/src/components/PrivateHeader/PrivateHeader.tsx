import { SessionUser } from '@mss/web/auth/sessionUser'
import { Routes } from '@mss/web/app/routing/routes'
import { UserMenu } from '../UserMenu'
import Link from 'next/link'

function PrivateHeader({ user }: { user: SessionUser }) {
  const links = [
    <a
      key="help"
      className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-question-line"
      target="_blank"
      rel="noreferrer"
      href="https://mon-suivi-social.gitbook.io/mon-suivi-social/"
    >
      Aide
    </a>,

    <UserMenu key="usermenu" user={user} />,
    <a
      key="logout"
      href={Routes.Connexion.Logout}
      className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-logout-box-r-line"
    >
      Se déconnecter
    </a>,
  ]

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-ml-4v fr-mr-4v">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <Link
                  href="/"
                  aria-current="page"
                  target="_self"
                  title="Mon Suivi Social"
                  style={{ display: 'flex' }}
                >
                  <div className="fr-header__logo">
                    <picture>
                      <img
                        alt="Mon Suivi Social"
                        width={240}
                        src="/images/logo.svg"
                      />
                    </picture>
                  </div>
                </Link>
                <div className="fr-header__navbar">
                  <button
                    id="fr-btn-menu-mobile"
                    aria-controls="modal-menu-mobile"
                    aria-haspopup="menu"
                    data-fr-opened="false"
                    data-fr-js-modal-button="true"
                    title="Menu"
                    className="fr-btn--menu fr-btn"
                  >
                    Menu
                  </button>
                </div>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  {links.map((link) => (
                    <li key={link.key}>{link}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modal-menu-mobile" className="fr-header__menu fr-modal">
        <div className="fr-container">
          <button
            aria-controls="modal-menu-mobile"
            className="fr-btn--close fr-btn"
          >
            Fermer
          </button>
          <div className="fr-header__menu-links">
            <ul className="fr-btns-group">
              {links.map((link) => (
                <li key={link.key}>{link}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PrivateHeader
