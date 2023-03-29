import { AuthCard } from './AuthCard'
import { InclusionConnectSigninButton } from './InclusionConnectSigninButton'
import styles from './SigninPanel.module.css'

const signinErrorMessage = (error?: string): string | undefined => {
  if (!error) {
    return error
  }

  if (error === 'OAuthAccountNotLinked') {
    return 'Vous venez de vous connecter par un nouvelle méthode. Par sécurité, veuillez utiliser la méthode de connexion que vous avez utilisé initialement.'
  }
  return 'Erreur de connexion, veuillez réessayer.'
}

export function SigninPanel({ error }: { error?: string }) {
  return (
    <AuthCard>
      <h2 className={`fr-mb-12v ${styles.signinTitle}`}>
        Se connecter à ma structure
      </h2>

      {error ? (
        <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-6v">
          <p>{signinErrorMessage(error)}</p>
        </div>
      ) : null}

      <InclusionConnectSigninButton className="fr-mb-3w" />

      <div className="fr-alert fr-alert--info fr-alert--sm fr-mb-3w">
        <p>
          Si vous avez des difficultés pour vous authentifier,{' '}
          <a href="mailto:monsuivisocial@anct.gouv.fr">contactez-nous</a>.
        </p>
      </div>

      <hr />
      <h5>Vous n&apos;avez pas de compte ?</h5>
      <p>
        Contactez votre responsable de structure pour plus d&apos;informations.
      </p>
    </AuthCard>
  )
}
