import { Beneficiary, User } from '@prisma/client'
import { Link } from '@mss/web/components/Generic/Link'
import {
  canDeleteBeneficiary,
  canEditBeneficiaryGeneralInfo,
} from '@mss/web/security/rules'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { Routes } from '@mss/web/app/routing/routes'

export function BeneficiaryManageActions({
  user,
  beneficiary,
  className,
}: {
  user: SessionUser
  beneficiary: Beneficiary & { referents: User[] }
  className?: string
}) {
  const { archived, fileNumber } = beneficiary

  const canEdit = canEditBeneficiaryGeneralInfo(user, beneficiary)
  const canArchive = canDeleteBeneficiary(user, beneficiary)

  const editLink = Routes.Beneficiaires.Beneficiaire.Modifier.path({
    fileNumber,
  })
  const archiveLink = Routes.Beneficiaires.Beneficiaire.Archiver.path({
    fileNumber,
  })

  return archived ? null : (
    <ul
      className={`fr-btns-group fr-btns-group--icon-left fr-btns-group--inline ${className}`}
    >
      {canEdit ? (
        <li>
          <Link
            href={editLink}
            className="fr-btn fr-icon-pencil-line fr-btn--tertiary-no-outline"
          >
            Modifier les informations
          </Link>
        </li>
      ) : null}
      {canArchive ? (
        <li>
          <Link
            href={archiveLink}
            className="fr-btn fr-icon-archive-line fr-btn--tertiary-no-outline"
          >
            Archiver le bénéficiaire
          </Link>
        </li>
      ) : null}
    </ul>
  )
}
