import { PublicWebAppConfig } from '@mss/web/webAppConfig'
import { LandingVideo } from '@mss/web/components/LandingVideo'
import { Link } from '@mss/web/components/Generic/Link'
import styles from './page.module.scss'

export default function HomePage() {
  return (
    <main className="fr-container fr-my-8w">
      <section className="fr-grid-row fr-grid-row--center fr-mb-16w">
        <div className={`fr-col-12 fr-col-lg-5 ${styles.landingContainerLeft}`}>
          <h1 className={styles.landingTitle}>
            Libérez du temps pour l&apos;accompagnement social
          </h1>
          <p className={styles.landingSubtitle}>
            {PublicWebAppConfig.projectTitle} est un logiciel simple et intuitif
            pour faciliter le suivi des bénéficiaires des structures
            d&apos;accompagnement social.
          </p>
          <Link className="fr-btn" href="/register" target="_self">
            Enregistrer sa structure
          </Link>
        </div>
        <div
          className={`fr-col-12 fr-col-lg-7 ${styles.landingContainerRight}`}
        >
          <LandingVideo />
        </div>
      </section>

      <section className="fr-grid-row fr-grid-row--center fr-mb-16w">
        <div className={`fr-col-12 fr-col-md-6 fr-col-lg-3 ${styles.feature}`}>
          <picture>
            <source srcSet="/images/home-01.svg" type="image/svg" />
            <img
              src="/images/home-01.svg"
              className={`fr-responsive-img ${styles.featureImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h5 fr-mb-2w">Complet</h2>
          <p>Un suivi complet de vos bénéficiaires</p>
        </div>
        <div className={`fr-col-12 fr-col-md-6 fr-col-lg-3 ${styles.feature}`}>
          <picture>
            <source srcSet="/images/home-02.svg" type="image/svg" />
            <img
              src="/images/home-02.svg"
              className={`fr-responsive-img ${styles.featureImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h5 fr-mb-2w">Simple</h2>
          <p>Toutes les fonctionnalités en quelques clics</p>
        </div>
        <div className={`fr-col-12 fr-col-md-6 fr-col-lg-3 ${styles.feature}`}>
          <picture>
            <source srcSet="/images/home-03.svg" type="image/svg" />
            <img
              src="/images/home-03.svg"
              className={`fr-responsive-img ${styles.featureImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h5 fr-mb-2w">Sécurisé</h2>
          <p>Une sécurisation maximale de données</p>
        </div>
        <div className={`fr-col-12 fr-col-md-6 fr-col-lg-3 ${styles.feature}`}>
          <picture>
            <source srcSet="/images/home-04.svg" type="image/svg" />
            <img
              src="/images/home-04.svg"
              className={`fr-responsive-img ${styles.featureImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h5 fr-mb-2w">Centralisé</h2>
          <p>Toutes vos infos au même endroit</p>
        </div>
      </section>

      <section
        className={`fr-grid-row fr-grid-row--center ${styles.listSection} fr-mb-14w`}
      >
        <div className="fr-col-12 fr-col-lg-5">
          <picture>
            <source srcSet="/images/home-05.svg" type="image/svg" />
            <img
              src="/images/home-05.svg"
              className="fr-responsive-img"
              alt=""
            />
          </picture>
        </div>
        <div className="fr-col-12 fr-col-lg-5">
          <h2 className="fr-h1">{PublicWebAppConfig.projectTitle}</h2>
          <ul className="fr-raw-list fr-mb-5v">
            <li className="fr-icon-success-fill">
              Aides légales et facultatives
            </li>
            <li className="fr-icon-success-fill">Statistiques</li>
            <li className="fr-icon-success-fill">Rappel des tâches</li>
            <li className="fr-icon-success-fill">Notifications entre agents</li>
            <li className="fr-icon-success-fill">Historique bénéficiaires</li>
            <li className="fr-icon-success-fill">Budget</li>
          </ul>
          <Link className="fr-btn" href="/register" target="_self">
            Enregistrer sa structure
          </Link>
        </div>
      </section>

      <section
        className={`fr-grid-row fr-grid-row--center ${styles.testimonySection}`}
      >
        <div className="fr-col-12">
          <h2>Témoignages</h2>
          <p>Ils et elles utilisent déjà {PublicWebAppConfig.projectTitle}</p>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <figure className="fr-quote">
                <blockquote>
                  <p className="fr-text--md">
                    J&apos;ai déjà eu l&apos;occasion d&apos;utiliser
                    d&apos;autres logiciels. Celui-ci est aéré et lumineux. Il
                    n&apos;est vraiment pas compliqué et très intuitif.
                  </p>
                </blockquote>
                <figcaption>
                  <p className="fr-quote__author">
                    Ludivine, Travailleuse social
                  </p>
                </figcaption>
              </figure>
            </div>
            <div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <figure className="fr-quote">
                <blockquote>
                  <p className="fr-text--md">
                    Les statistiques sont déjà modélisées, c&apos;est bien,
                    c&apos;est ce que l&apos;on cherche. On souhaite mettre en
                    valeur le travail des structures et nous avons besoin
                    d&apos;un outil de pilotage pour vraiment connaître les
                    besoins en accompagnements sur le territoire.
                  </p>
                </blockquote>
                <figcaption>
                  <p className="fr-quote__author">
                    Julien, Responsable mission numérique au sein d&apos;un
                    département
                  </p>
                </figcaption>
              </figure>
            </div>
            <div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <figure className="fr-quote">
                <blockquote>
                  <p className="fr-text--md">
                    Tout colle avec ce que j&apos;ai aujourd&apos;hui dans mon
                    formulaire d&apos;entretien. On sent que l&apos;outil à été
                    créé avec une expérience terrain. Je suis contente, ça
                    répond parfaitement à nos besoins ici. C&apos;est aussi un
                    argument dans le cadre d&apos;une mobilité professionnelle,
                    pour faciliter le recrutement.
                  </p>
                </blockquote>
                <figcaption>
                  <p className="fr-quote__author">
                    Lucie, Chargée de l&apos;action sociale et responsable
                    d&apos;un CCAS
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
