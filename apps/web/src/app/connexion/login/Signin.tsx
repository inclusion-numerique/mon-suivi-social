import { EmailSigninForm } from '@mss/web/app/connexion/EmailSigninForm'
import { AuthCard } from '@mss/web/app/connexion/AuthCard'
import { InclusionConnectSigninButton } from '@mss/web/app/connexion/InclusionConnectSigninButton'

const signinErrorMessage = (error?: string): string | undefined => {
  if (!error) {
    return error
  }

  if (error === 'OAuthAccountNotLinked') {
    return 'Vous venez de vous connecter par un nouvelle méthode. Par sécurité, veuillez utiliser la méthode de connexion que vous avez utilisé initiallement.'
  }
  return 'Erreur de connexion, veuillez réessayer.'
}

export function Signin({ error }: { error?: string }) {
  return <AuthCard>
    <h2 style={{ textAlign: 'center' }} className="fr-mb-12v">
      Connexion à Mon Suivi Social
    </h2>
    {error ? (
      <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-6v">
        <p>{signinErrorMessage(error)}</p>
      </div>
    ) : null}

    <div className="fr-mb-6v">
      <h5>Se connecter avec Inclusion Connect</h5>
      <div className="fr-connect-group">
        <InclusionConnectSigninButton />
        <p>
          <a
            href="https://kindly-sunscreen-95c.notion.site/Simplifions-l-utilisation-des-services-destination-des-professionnels-de-l-inclusion-ded9135197654da590f5dde41d8bb68b"
            target="_blank"
            rel="noreferrer"
            title="Qu’est-ce que Inclusion Connect ? - nouvelle fenêtre"
          >
            Qu’est-ce que Inclusion Connect ?
          </a>
        </p>
      </div>
    </div>
    <p className="fr-hr-or">ou</p>
    <h5>Se connecter avec votre email</h5>
    <div>
      <EmailSigninForm />
    </div>
    <hr />
    <h5>Vous n’avez pas de compte ?</h5>
    <p>
      Contactez votre responsable de structure pour plus d&apos;informations.
    </p>
  </AuthCard>
}
