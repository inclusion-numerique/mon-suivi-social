import Link from 'next/link'
import { ReactNode } from 'react'
import { Routes } from '@mss/web/app/routing/routes'

const PublicHeader = ({
  hideRepublic,
  hideSigninButton,
  fullWidth,
  rootPath = '/',
  headerTools = (
    <div className="fr-header__tools">
      <div className="fr-header__tools-links">
        <ul className="fr-btns-group">
          {hideSigninButton ? null : (
            <li>
              <a
                className="fr-btn fr-btn--tertiary fr-icon-user-setting-line"
                href={Routes.Connexion.Login}
              >
                Se connecter
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  ),
  mobileMenuLinks = (
    <div className="fr-header__menu-links">
      <ul className="fr-btns-group">
        {hideSigninButton ? null : (
          <li>
            <Link
              className="fr-btn fr-btn--icon-left fr-icon-user-setting-line"
              href={Routes.Connexion.Login}
            >
              Se connecter
            </Link>
          </li>
        )}
      </ul>
    </div>
  ),
}: {
  hideRepublic?: boolean
  rootPath?: string
  hideSigninButton?: boolean
  fullWidth?: boolean
  headerTools?: ReactNode
  mobileMenuLinks?: ReactNode
}) => {
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className={fullWidth ? 'fr-pl-4v' : 'fr-container'}>
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <Link
                  href={rootPath}
                  aria-current="page"
                  target="_self"
                  title="Mon Suivi Social"
                  style={{ display: 'flex' }}
                >
                  {hideRepublic ? null : (
                    <div className="fr-header__logo">
                      <p className="fr-logo">
                        République
                        <br />
                        Française
                      </p>
                    </div>
                  )}
                  <div className="fr-header__logo">
                    <picture>
                      <img width={240} src="/images/logo.svg" />
                    </picture>
                  </div>
                </Link>
                <div className="fr-header__navbar">
                  <button
                    id="fr-btn-menu-mobile"
                    data-fr-opened="false"
                    aria-controls="modal-menu-mobile"
                    aria-haspopup="menu"
                    title="Menu"
                    className="fr-btn--menu fr-btn"
                    data-fr-js-modal-button="true"
                  >
                    Menu
                  </button>
                </div>
              </div>
            </div>
            {headerTools}
          </div>
        </div>
      </div>
      <div
        id="modal-menu-mobile"
        className="fr-header__menu fr-modal"
        data-fr-js-modal="true"
        data-fr-js-header-modal="true"
      >
        <div className="fr-container">
          <button
            aria-controls="modal-menu-mobile"
            className="fr-btn--close fr-btn"
          >
            Fermer
          </button>
          {mobileMenuLinks}
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
