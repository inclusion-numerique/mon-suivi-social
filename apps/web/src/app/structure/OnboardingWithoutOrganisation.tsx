import { SessionUser } from '@mss/web/auth/sessionUser'
import { getUserDisplayName } from '@mss/web/utils/user'

import Link from 'next/link'
import { Routes } from '@mss/web/app/routing/routes'
import { AuthCard } from '@mss/web/app/(public)/connexion/AuthCard'

const OnboardingWithoutOrganisation = ({ user }: { user: SessionUser }) => (
  <AuthCard>
    <div className="fr-grid-row fr-grid-row--center">
      <picture>
        <img
          src="/dsfr/artwork/pictograms/system/system.svg"
          alt="Boite email"
          style={{ textAlign: 'center', width: 96 }}
        />
      </picture>
    </div>
    <h2 style={{ textAlign: 'center' }} className="fr-mt-4v">
      Compte en attente
    </h2>
    <p style={{ textAlign: 'center' }}>
      Bienvenue {getUserDisplayName(user)}.<br />
      <br />
      Vous aurez accès aux fonctionnalités de Mon suivi social une fois que
      votre responsable de structure ou un administrateur aura terminé la
      configuration de votre compte.
      <br />
      <br />
      En cas de questions, veuillez contacter votre responsable de structure.
    </p>
    <div className="fr-btns-group">
      <Link href="/" className="fr-btn fr-mb-0">
        Retour à l&apos;accueil
      </Link>
    </div>
    <div className="fr-grid-row fr-grid-row--center">
      <Link href={Routes.Connexion.Logout} className="fr-mt-4v">
        Se déconnecter
      </Link>
    </div>
  </AuthCard>
)

export default OnboardingWithoutOrganisation
