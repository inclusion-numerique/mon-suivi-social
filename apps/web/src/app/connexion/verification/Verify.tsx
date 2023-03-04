import { PublicConfig } from '@mss/web/config'
import { AuthCard } from '@mss/web/components/SigninPanel/AuthCard'
import { cookies } from 'next/headers'

export function Verify() {
  const email = cookies().get('email-signin')?.value
  return (
    <AuthCard>
      <div className="fr-grid-row fr-grid-row--center">
        <picture>
          <img
            src="/dsfr/artwork/pictograms/digital/mail-send.svg"
            alt="Boite email"
            style={{ textAlign: 'center', width: 96 }}
          />
        </picture>
      </div>
      <h2 style={{ textAlign: 'center' }} className="fr-mt-4v">
        Rendez-vous dans votre boite email
      </h2>
      <p style={{ textAlign: 'center' }}>
        {email ? (
          <>Un lien de connexion sécurisé a été envoyé à l’adresse {email}.</>
        ) : (
          <>Un lien de connexion sécurisé vous a été envoyé par&nbsp;email.</>
        )}
        <br />
        Veuillez l&apos;utiliser pour vous connecter.
      </p>
      <p className="fr-text--sm fr-mb-0" style={{ textAlign: 'center' }}>
        Vous pouvez fermer cet onglet de navigation.
        <br />
        En cas de problème ou de questions, merci de contacter{' '}
        <a href={`mailto:${PublicConfig.contactEmail}`}>
          {PublicConfig.contactEmail}
        </a>
        .
      </p>
    </AuthCard>
  )
}
