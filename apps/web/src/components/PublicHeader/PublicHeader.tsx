import { Link } from '@mss/web/components/Generic/Link'
import { Routes } from '@mss/web/app/routing/routes'
import { PublicWebAppConfig } from '@mss/web/webAppConfig'

function PublicHeader({ hideSigninButton }: { hideSigninButton?: boolean }) {
  const links = hideSigninButton
    ? []
    : [
        <Link
          key="signin"
          className="fr-btn fr-btn--icon-left fr-icon-user-setting-line"
          href={Routes.Connexion.Login}
        >
          Se connecter
        </Link>,
      ]

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <Link
                  href="/"
                  aria-current="page"
                  target="_self"
                  title={PublicWebAppConfig.projectTitle}
                  style={{ display: 'flex' }}
                >
                  <div className="fr-header__logo">
                    <p className="fr-logo">
                      République
                      <br />
                      Française
                    </p>
                  </div>
                  <div className="fr-header__logo">
                    <picture>
                      <img
                        alt={PublicWebAppConfig.projectTitle}
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

export default PublicHeader
