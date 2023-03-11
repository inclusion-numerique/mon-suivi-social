'use client'

import { PublicWebAppConfig } from '@mss/web/webAppConfig'
import { PropsWithChildren } from 'react'

export function ServerError() {
  return (
    <GenericError
      title="Erreur inattendue"
      subtitle="Erreur 500"
      lead="Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible."
    >
      Essayez de rafraichir la page ou bien ressayez plus tard.
      <br />
      Si vous avez besoin d&apos;une aide immédiate, merci de nous contacter.
    </GenericError>
  )
}

export function NotFoundError() {
  return (
    <GenericError
      title="Page non trouvée"
      subtitle="Erreur 404"
      lead="La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée."
    >
      Si vous avez tapé l&apos;adresse web dans le navigateur, vérifiez
      qu&apos;elle est correcte. La page n’est peut-être plus disponible.
      <br />
      Dans ce cas, pour continuer votre visite vous pouvez consulter notre page
      d’accueil.
    </GenericError>
  )
}

export function UnauthorizedError() {
  return (
    <GenericError
      title="Accès refusé"
      subtitle="Erreur 403"
      lead="Vous n'avez pas accès à cette page."
    >
      Si vous avez tapé l&apos;adresse web dans le navigateur, vérifiez
      qu&apos;elle est correcte.
    </GenericError>
  )
}

export function GenericError({
  title,
  subtitle,
  lead,
  children,
}: PropsWithChildren<{
  title: string
  subtitle: string
  lead: string
}>) {
  return (
    <main role="main" id="content">
      <div className="fr-container">
        <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div className="fr-py-0 fr-col-12 fr-col-md-6 fr-col-offset-md-1">
            <h1>{title}</h1>
            <p className="fr-text--sm fr-mb-3w">{subtitle}</p>
            <p className="fr-text--lg fr-mb-3w">{lead}</p>
            <p className="fr-text--sm fr-mb-6w">{children}</p>
            <ul className="fr-btns-group fr-btns-group--inline-md">
              <li>
                <a className="fr-btn" href="/">
                  Page d&apos;accueil
                </a>
              </li>
              <li>
                <a
                  className="fr-btn fr-btn--secondary"
                  href={`mailto:${PublicWebAppConfig.contactEmail}`}
                >
                  Contactez-nous
                </a>
              </li>
            </ul>
          </div>
          <div className="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fr-responsive-img fr-artwork"
              aria-hidden="true"
              width="160"
              height="200"
              viewBox="0 0 160 200"
            >
              <use
                className="fr-artwork-motif"
                href="/dsfr/artwork/background/ovoid.svg"
              />
              <use
                className="fr-artwork-background"
                href="/dsfr/artwork/background/ovoid.svg#artwork-background"
              />
              <g transform="translate(40, 60)">
                <use
                  className="fr-artwork-decorative"
                  href="/dsfr/artwork/pictograms/system/technical-error.svg#artwork-decorative"
                />
                <use
                  className="fr-artwork-minor"
                  href="/dsfr/artwork/pictograms/system/technical-error.svg#artwork-minor"
                />
                <use
                  className="fr-artwork-major"
                  href="/dsfr/artwork/pictograms/system/technical-error.svg#artwork-major"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </main>
  )
}
