'use client'

import {
  followupStatusClasses,
  followupStatusLabels,
} from '@mss/web/client/options/followup'
import {
  helpRequestStatusBadgeClasses,
  helpRequestStatusLabels,
} from '@mss/web/client/options/helpRequest'
import { SupportListItem } from '@mss/web/server/query'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { getUserDisplayName } from '@mss/web/utils/user'
import styles from './SupportHeader.module.scss'

const SupportHeader = ({
  support,
  accordionId,
  toggleAccordion,
  expanded,
}: {
  support: SupportListItem
  accordionId: string
  toggleAccordion: () => void
  expanded: boolean
}) => {
  const { isHelpRequest } = support

  const firstFollowup = isHelpRequest ? false : support.firstFollowup
  const fullFile = isHelpRequest ? support.fullFile : false

  let redirectedLabel = ''
  if (!isHelpRequest && support.redirected) {
    const label = 'Réorienté'
    redirectedLabel = support.prescribingOrganization
      ? `${label} : ${support.prescribingOrganization.name}`
      : label
  }

  const detail = firstFollowup
    ? '1<sup>er</sup> entretien'
    : fullFile
    ? 'Dossier complet'
    : ''

  const creator = support.createdBy
    ? getUserDisplayName(support.createdBy)
    : 'Système'
  const statusLabel = isHelpRequest
    ? helpRequestStatusLabels[support.status]
    : followupStatusLabels[support.status]
  const statusBadgeClass = isHelpRequest
    ? helpRequestStatusBadgeClasses[support.status]
    : followupStatusClasses[support.status]

  const historyTypeLabel = isHelpRequest
    ? "l'instruction de demande d'aide"
    : "la synthèse d'entretien"

  const collapseBtnLabel = `Voir les détails de ${historyTypeLabel}`

  const followupTypes = isHelpRequest ? [support.type] : support.types

  const collapseBtnIcon = expanded
    ? 'fr-icon-subtract-line'
    : 'fr-icon-add-line'

  const typeClass = support.isHelpRequest
    ? styles.helpRequestDetails
    : styles.interviewDetails

  return (
    <div
      className={`${styles.beneficiaryHistoryDetailsAccordionTitle} ${typeClass}`}
    >
      <div className={styles.meta}>
        <div className={styles.agentName}>{creator}</div>
        <h2 className={`${styles.date}`}>{`${dateAsDay(
          support.historyDate,
        )}`}</h2>
        <div className={styles.additionalMeta}>{detail}</div>
        <ul className={`fr-badges-group ${styles.statusBadges}`}>
          <li>
            <p className={`fr-badge ${statusBadgeClass}`}>{statusLabel}</p>
          </li>
          {redirectedLabel && (
            <p className="fr-badge fr-badge--purple-glycine">redirectedLabel</p>
          )}
          {/* <li v-if="hasUnreadNotifications">
              <p className="fr-badge fr-badge--new fr-badge--no-icon">
                <span className="fr-icon-notification-3-fill fr-icon--sm" />
              </p>
            </li>  */}
        </ul>
      </div>
      <hr className={styles.divider} />
      <ul className={`fr-badges-group ${styles.followupTypesBadges}`}>
        {followupTypes.map((followupType) => (
          <li key={followupType.id}>
            <p className="fr-badge">{followupType.name}</p>
          </li>
        ))}
      </ul>
      <button
        aria-expanded="false"
        aria-controls={accordionId}
        onClick={toggleAccordion}
        className={`fr-btn fr-btn--tertiary ${styles.collapseBtn}`}
      >
        <span className={collapseBtnIcon} /> <span>{collapseBtnLabel}</span>
      </button>
    </div>
  )
}

export { SupportHeader }
