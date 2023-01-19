import Link from 'next/link'

export const Breadcrumbs = ({
  currentPage,
  parents = [],
}: {
  currentPage: string
  parents?: { title: string; href: string }[]
}) => {
  return (
    <nav
      role="navigation"
      className="fr-breadcrumb"
      aria-label="vous êtes ici :"
      data-fr-js-breadcrumb="true"
    >
      <button
        className="fr-breadcrumb__button"
        aria-expanded="false"
        aria-controls="breadcrumbs"
        data-fr-js-collapse-button="true"
      >
        Voir le fil d’Ariane
      </button>
      <div className="fr-collapse" id="breadcrumbs" data-fr-js-collapse="true">
        <ol className="fr-breadcrumb__list">
          <li>
            <Link className="fr-breadcrumb__link" href="/">
              Accueil
            </Link>
          </li>
          {parents.map(({ title, href }) => (
            <li key={href}>
              <Link className="fr-breadcrumb__link" href={href}>
                {title}
              </Link>
            </li>
          ))}
          <li>
            <a className="fr-breadcrumb__link" aria-current="page">
              {currentPage}
            </a>
          </li>
        </ol>
      </div>
    </nav>
  )
}
