import { LandingVideo } from '@mss/web/components/LandingVideo'
import { PublicWebAppConfig } from '@mss/web/webAppConfig'
import styles from './page.module.scss'

export default function HomePage() {
  return (
    <main className="fr-container fr-my-8w">
      <div className="fr-grid-row fr-my-5w">
        <div className="fr-col fr-col-lg-8 fr-col-offset-lg-2">
          <h1 className={styles.registerTitle}>
            L&apos;équipe de {PublicWebAppConfig.projectTitle} se charge de
            créer votre espace
          </h1>
        </div>
      </div>

      <section
        className={`fr-grid-row fr-grid-row--center ${styles.registerStepGrid}`}
      >
        <div className="fr-col-12 fr-col-md-6 fr-col-lg-3">
          <picture>
            <source srcSet="/images/register-01.svg" type="image/svg" />
            <img
              src="/images/register-01.svg"
              className={`fr-responsive-img ${styles.registerStepImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h3">01. Participez au prochain webinaire</h2>
          <a
            href="https://app.livestorm.co/incubateur-des-territoires/demonstration-de-loutil-mon-suivi-social"
            target="_blank"
            className="fr-btn"
            title="Nouvel onglet - Inscription au webinaire"
            rel="noreferrer"
          >
            S&apos;inscrire au webinaire
          </a>
        </div>
        <div className="fr-col-12 fr-col-md-6 fr-col-lg-3">
          <picture>
            <source srcSet="/images/register-02.svg" type="image/svg" />
            <img
              src="/images/register-02.svg"
              className={`fr-responsive-img ${styles.registerStepImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h3">02. Renseignez vos informations</h2>
          <a
            href="https://framaforms.org/mon-suivi-socialconfiguration-de-votre-espace-de-travail-1675077455"
            target="_blank"
            className="fr-btn"
            title="Nouvel onglet - Remplir le formulaire"
            rel="noreferrer"
          >
            Remplir le formulaire
          </a>
        </div>
        <div className="fr-col-12 fr-col-md-6 fr-col-lg-3">
          <picture>
            <source srcSet="/images/register-03.svg" type="image/svg" />
            <img
              src="/images/register-03.svg"
              className={`fr-responsive-img ${styles.registerStepImg}`}
              alt=""
            />
          </picture>
          <h2 className="fr-h3">03. Connectez-vous à votre espace</h2>
        </div>
      </section>

      <section className="fr-grid-row fr-grid-row--center fr-mb-4w">
        <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <p className="landing-subtitle">
            Pour toute question, contactez-nous{' '}
            <a
              href="mailto:monsuivisocial@anct.gouv.fr"
              className={styles.mailtoLink}
            >
              monsuivisocial@anct.gouv.fr
            </a>
          </p>
        </div>
      </section>

      <section className="fr-grid-row fr-grid-row--center">
        <LandingVideo />
      </section>
    </main>
  )
}
