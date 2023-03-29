export function LandingVideo() {
  return (
    <figure role="group" className="fr-content-media fr-content-media--sm">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="fr-responsive-vid"
        controls
        poster="/images/video-presentation-preview.jpg"
        preload="none"
        width="100%"
      >
        {/* Credit Adrien Di Pasquale - the href is a fix for a bad rule in DSFR */}
        <source src="/video/presentation.webm" type="video/webm" />
        <source src="/video/presentation.mp4" type="video/mp4" />
      </video>
      <figcaption className="fr-sr-only">
        Présentation des fonctionnalités de Mon Suivi Social
        <a href="/video/presentation.webm" target="_blank" rel="noreferrer">
          Nouvel onglet - Vidéo de présentation des fonctionnalités de Mon Suivi
          Social
        </a>
      </figcaption>
      <div className="fr-sr-only">
        <h2>Mon Suivi Social - Présentation</h2>
        <p>Libérez du temps pour l&apos;accompagnement social.</p>
        <p>
          Un logiciel simple et gratuit pour centraliser le suivi des
          bénéficiaires des structures de l&apos;accompagnement social, porté
          par l&apos;Agence Nationale de la cohésion des territoires.
        </p>
        <h3>Qu&apos;est-ce que c&apos;est ?</h3>
        <h4>Suivi complet des bénéficiaires</h4>
        <ul>
          <li>Répertoire des bénéficiaires</li>
          <li>Suivi des accompagnements</li>
          <li>Aides légales et facultatives</li>
          <li>Module de statistiques</li>
        </ul>
        <h4>Partage d&apos;informations</h4>
        <ul>
          <li>Données centralisées et numériques</li>
          <li>Notifications entre agents</li>
          <li>Rappel de tâches</li>
          <li>Gestion des rendez-vous avec RDV-solidarité (à venir)</li>
        </ul>
        <h4>Données sécurisées</h4>
        <ul>
          <li>Conformité RGPD</li>
          <li>Accès configurable par profile</li>
          <li>Hébergement hautement sécurisé</li>
          <li>Accès aux données personnalisable</li>
        </ul>
        <h3>Comment ça marche ?</h3>
        <p>6 étapes simples pour un suivi complet</p>
        <ol>
          <li>
            Enregistrez votre structure. Créez un compte facilement et invitez
            vos agents.
          </li>
          <li>
            Créez vos bénéficiaires. De nombreux champs peuvent être complétés.
          </li>
          <li>
            Personnalisez vos types d&apos;aides. Configurez les aides légales
            et vos aides facultatives.
          </li>
          <li>
            Centralisez vos bénéficiaires. Retrouvez toutes les fiches
            bénéficiaires en 1 clic.
          </li>
          <li>
            Consignez vos historiques. Pour chaque bénéficiaire, ajoutez toutes
            les étapes de son accompagnement.
          </li>
          <li>
            Disposez de vos statistiques. Les statistiques sont créés
            automatiquement et en temps réel.
          </li>
        </ol>
        <p>
          Contactez-nous :
          <a href="mailto:monsuivisocial@anct.gouv.fr">
            monsuivisocial@anct.gouv.fr
          </a>
        </p>
      </div>
    </figure>
  )
}
