import {
  beneficiaryStatusBadgeClasses,
  beneficiaryStatusLabels,
} from '@mss/web/client/options/beneficiary'
import { AttributesListItem } from '@mss/web/components/Generic'
import styles from './BeneficiaryMetaAttributes.module.css'
import { getUserDisplayName } from '@mss/web/utils/user'
import { Beneficiary, User } from '@prisma/client'

export function BeneficiaryMetaAttributes({
  beneficiary: { status, aidantConnectAuthorized, fileNumber, referents },
  className,
}: {
  beneficiary: Beneficiary & { referents: User[] }
  className?: string
}) {
  const statusLabel = beneficiaryStatusLabels[status]
  const statusBadgeClass = beneficiaryStatusBadgeClasses[status]
  const mandatAidantConnectLabel = aidantConnectAuthorized ? 'Activé' : 'Absent'
  const mandatAidantConnectBadgeClass = aidantConnectAuthorized
    ? 'fr-badge--success'
    : ''

  return (
    <ul
      className={`fr-raw-list ${styles.beneficiaryMetaAttributes} ${className}`}
    >
      <AttributesListItem item={['N° dossier', fileNumber]} />
      <AttributesListItem
        item={[
          referents.length === 1 ? 'Agent référent' : 'Agents référents',
          referents.length === 0
            ? 'Aucun'
            : referents.map(getUserDisplayName).join(', '),
        ]}
      />
      <AttributesListItem
        item={[
          'Statut du dossier',
          <span
            key="status"
            className={`fr-badge fr-badge--sm ${statusBadgeClass}`}
          >
            {statusLabel}
          </span>,
        ]}
      />
      <AttributesListItem
        item={[
          'Mandat Aidant Connect',
          <span
            key="mandat-aidant-connect"
            className={`fr-badge fr-badge--sm ${mandatAidantConnectBadgeClass}`}
          >
            {mandatAidantConnectLabel}
          </span>,
        ]}
      />
    </ul>
  )
}
