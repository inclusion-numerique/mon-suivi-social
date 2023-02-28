import { PropsWithChildren } from 'react'

function HomeCard({
  title,
  image,
  children,
}: PropsWithChildren<{ image: string; title: string }>) {
  return <div className="fr-card">
    <div className="fr-card__body">
      <div className="fr-card__content">
        <h3 className="fr-card__title">{title}</h3>
        <div className="fr-card__desc">{children}</div>
      </div>
    </div>
    <div className="fr-card__header">
      <div className="fr-card__img fr-pt-4v" style={{ textAlign: 'center' }}>
        <picture>
          <source srcSet={image} type="image/svg" />
          <img src={image} alt={title} className="fr-mx-auto" />
        </picture>
      </div>
    </div>
  </div>
}

export default function HomePage() {
  return (
    <div className="fr-container fr-py-6w">
      <div className="fr-grid-row fr-mt-8v">
        <div
          className="fr-col-12 fr-hidden-md fr-pb-4v"
          style={{ textAlign: 'center' }}
        >
          <picture>
            <source srcSet="/images/home-hero.svg" type="image/svg" />
            <img
              className="fr-responsive-img"
              src="/images/home-hero.svg"
              alt="Illustration mon suivi social"
              style={{ maxWidth: 480 }}
            />
          </picture>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <h1>Bienvenue sur Mon suivi social</h1>
          <h5>
            Ce service facilite le suivi des bénéficiaires des structures
            d&apos;accompagnement social
          </h5>
          <p>
            Libérez du temps pour l&apos;accompagnement social grâce à un
            logiciel complet, sécurisé et intuitif.
          </p>
          <a
            className="fr-btn fr-btn--icon-left fr-icon-mail-line"
            href="mailto:monsuivisocial@anct.gouv.fr"
          >
            Contactez-nous
          </a>
        </div>
        <div className="fr-hidden fr-unhidden-md fr-col-md-6">
          <picture>
            <img
              className="fr-responsive-img"
              src="/images/home-hero.svg"
              alt="Illustration mon suivi social"
              style={{ maxWidth: 700 }}
            />
          </picture>
        </div>
      </div>
      <div className="fr-grid-row fr-mt-8v fr-mb-8v fr-grid-row--gutters">
        <div className="fr-col fr-col-md-4">
          <HomeCard title="Suivi des bénéficiaires" image="/images/home-01.svg">
            <ul>
              <li>Aides légales et facultatives</li>
              <li>Domiciliation</li>
              <li>Module de statistiques</li>
            </ul>
          </HomeCard>
        </div>
        <div className="fr-col fr-col-md-4">
          <HomeCard
            title="Partage d'infos entre agents"
            image="/images/home-02.svg"
          >
            <ul>
              <li>Données centralisées</li>
              <li>Agenda partagé</li>
              <li>Rappel des tâches</li>
            </ul>
          </HomeCard>
        </div>
        <div className="fr-col fr-col-md-4">
          <HomeCard
            title="Données de santé sécurisées"
            image="/images/home-03.svg"
          >
            <ul>
              <li>Conformité RGPD</li>
              <li>Accès configurable</li>
              <li>Hébergement sécurisé</li>
            </ul>
          </HomeCard>
        </div>
      </div>
    </div>
  )
}
