import { Link } from '@mss/web/components/Generic/Link'
import { PublicWebAppConfig } from '@mss/web/webAppConfig'
import styles from './PublicFooter.module.css'

function PublicFooter() {
  return (
    <footer
      id="footer"
      role="contentinfo"
      className={`fr-footer ${styles.footer}`}
    >
      <div className="fr-container">
        <div className="fr-footer__body fr-footer__body--operator">
          <div className="fr-footer__brand fr-enlarge-link">
            <a
              href="https://agence-cohesion-territoires.gouv.fr/"
              title="Site Web de l'Agence Nationale de la Cohésion des Territoires"
              className="fr-footer__brand-link"
            >
              <picture>
                <img
                  src="/images/logo-anct.svg"
                  alt="Logo de l'Agence Nationale de la Cohésion des Territoires"
                  width={200}
                  className="fr-footer__logo"
                />
              </picture>
            </a>
          </div>
          <div className="fr-footer__content">
            <ul className="fr-footer__content-list">
              <li className="fr-footer__bottom-item">
                <a
                  className="fr-footer__bottom-link"
                  href="https://stock.adobe.com/fr/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Crédits photos : Adobe Stock
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  href="https://gouvernement.fr"
                  className="fr-footer__content-link"
                  target="_blank"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  href="https://service-public.fr"
                  className="fr-footer__content-link"
                  target="_blank"
                >
                  service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  href="https://data.gouv.fr"
                  className="fr-footer__content-link"
                  target="_blank"
                >
                  data.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  href="https://beta.gouv.fr"
                  className="fr-footer__content-link"
                  target="_blank"
                >
                  beta.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/confidentialite">
                Politique de confidentialité
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href="/accessibilite">
                Accessibilité : non conforme
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href={PublicWebAppConfig.repository}
                target="_blank"
                rel="noreferrer"
                title="Code source"
              >
                Code source
              </a>
            </li>
          </ul>
        </div>
        <div className="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous{' '}
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              target="_blank"
              rel="noreferrer"
            >
              licence etalab-2.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
