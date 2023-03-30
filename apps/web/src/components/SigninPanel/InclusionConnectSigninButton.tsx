'use client'

import { signIn } from 'next-auth/react'
import { inclusionConnectProviderId } from '@mss/web/auth/inclusionConnect'
import styles from './InclusionConnectSigninButton.module.css'

export function InclusionConnectSigninButton({
  className,
}: {
  className?: string
}) {
  return (
    <div className={`${styles.inclusionConnectSection} ${className}`}>
      <button
        className={`${styles.inclusionConnectBtn} fr-btn`}
        title="S'identifier avec InclusionConnect"
        onClick={() => signIn(inclusionConnectProviderId)}
      >
        <span>
          Se connecter avec
          <strong>InclusionConnect</strong>
        </span>
      </button>

      <a
        className="fr-link--sm"
        href="https://plateforme-inclusion.notion.site/Un-compte-unique-pour-mes-services-num-riques-ded9135197654da590f5dde41d8bb68b"
        target="_blank"
        rel="noreferrer"
        title="Qu'est-ce qu'Inclusion Connect ? - nouvelle fenêtre"
      >
        En savoir plus
      </a>
    </div>
  )
}
