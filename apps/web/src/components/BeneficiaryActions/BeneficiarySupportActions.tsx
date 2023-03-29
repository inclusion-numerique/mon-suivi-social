import { Beneficiary, User } from '@prisma/client'
import { Link } from '@mss/web/components/Generic/Link'
import { canCreateBeneficiaryHelpRequest } from '@mss/web/security/rules'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { Routes } from '@mss/web/app/routing/routes'
import styles from './BeneficiarySupportActions.module.css'

export function BeneficiarySupportActions({
  user,
  beneficiary,
}: {
  user: SessionUser
  beneficiary: Beneficiary & { referents: User[] }
}) {
  const { archived, fileNumber } = beneficiary

  const canCreateHelpRequest = canCreateBeneficiaryHelpRequest(
    user,
    beneficiary,
  )

  const createFollowupLink = Routes.Accompagnements.Entretien.Nouveau.path({
    dossier: fileNumber,
  })
  const createHelpRequestLink =
    Routes.Accompagnements.DemandeDAide.Nouvelle.path({
      dossier: fileNumber,
    })

  return archived ? null : (
    <ul
      className={`fr-btns-group fr-btns-group--icon-left fr-btns-group--inline ${styles.beneficiarySupportActions}`}
    >
      <li>
        <Link
          href={createFollowupLink}
          className="fr-btn fr-icon-file-add-line"
        >
          Synthèse d&apos;entretien
        </Link>
      </li>
      {canCreateHelpRequest ? (
        <li>
          <Link
            href={createHelpRequestLink}
            className="fr-btn fr-icon-file-add-line"
          >
            Demande d&apos;aide
          </Link>
        </li>
      ) : null}
      <li>
        <Link
          href="https://www.mesdroitssociaux.gouv.fr/dd1pnds-ria/#destination/simu-foyer"
          target="_blank"
          className="fr-link"
        >
          Simulation de droits sociaux
        </Link>
      </li>
    </ul>
  )
}
