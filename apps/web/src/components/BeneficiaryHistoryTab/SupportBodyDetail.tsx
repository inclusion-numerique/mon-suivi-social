import { SessionUser } from '@mss/web/auth/sessionUser'
import {
  followupInterventionLabels,
  followupMediumLabels,
  followupSignalementLabels,
} from '@mss/web/client/options/followup'
import {
  helpRequestReasonLabels,
  paymentMethodLabels,
} from '@mss/web/client/options/helpRequest'
import { SupportListItem } from '@mss/web/server/query'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { euros } from '@mss/web/utils/euros'
import { HelpRequestStatus } from '@prisma/client'
import styles from './SupportBodyDetail.module.scss'

const getHelpRequestAllocatedAmount = (support: SupportListItem) => {
  if (!support.isHelpRequest) return ''
  let allocatedAmount = ''
  if (support.allocatedAmount) {
    allocatedAmount += euros(support.allocatedAmount)
  }
  if (support.paymentDate || support.paymentMethod) {
    if (allocatedAmount) allocatedAmount += ' '
    allocatedAmount += '('
  }
  if (support.paymentDate) {
    allocatedAmount += dateAsDay(support.paymentDate)
    allocatedAmount += support.paymentMethod ? ' - ' : ')'
  }
  if (support.paymentMethod) {
    allocatedAmount += `${paymentMethodLabels[support.paymentMethod]}`
  }
  return allocatedAmount
}

const getFollowupMedium = (support: SupportListItem) => {
  if (support.isHelpRequest) return null
  const label = followupMediumLabels[support.medium]
  if (!support.place && !support.thirdPersonName) {
    return label
  }
  return `${label} - ${support.place || support.thirdPersonName}`
}

const getFollowupInterventions = (support: SupportListItem) => {
  if (support.isHelpRequest) {
    return null
  }
  return support.interventions
    ?.map((i) => followupInterventionLabels[i])
    .join(', ')
}

const getFollowupSignalements = (support: SupportListItem) => {
  if (support.isHelpRequest) {
    return null
  }
  return support.signalements
    ?.map((i) => followupSignalementLabels[i])
    .join(', ')
}

const getHelpRequestReason = (support: SupportListItem) => {
  if (support.isInterview) {
    return null
  }
  return support.reason ? helpRequestReasonLabels[support.reason] : null
}

const HideIfEmptyInfo = ({
  label,
  value,
}: {
  label: string
  value: string | null
}) => {
  if (value) {
    return (
      <li>
        <span className={styles.informationLabel}>{`${label}: `}</span>
        <span>{`${value}`}</span>
      </li>
    )
  }
  return null
}

export const SupportBodyDetail = ({
  support,
}: {
  support: SupportListItem
}) => (
  // const isMinistryAgent = useMinistryAgent()

  <ul className={styles.informationList}>
    <HideIfEmptyInfo label="Type" value={getFollowupMedium(support)} />
    <HideIfEmptyInfo label="Motif" value={getHelpRequestReason(support)} />
    <HideIfEmptyInfo label="Motif" value={getHelpRequestReason(support)} />

    {/* <div v-if="isMinistryAgent"> */}
    <HideIfEmptyInfo label="Numéro Pégase" value={support.numeroPegase} />
    <HideIfEmptyInfo label="Ministre" value={support.ministre} />
    {/* </div> */}
    <HideIfEmptyInfo
      label="Date d'échéance"
      value={dateAsDay(support.dueDate)}
    />
    <HideIfEmptyInfo
      label="Organisme prescripteur"
      value={support.prescribingOrganization?.name || null}
    />
    <HideIfEmptyInfo
      label="Instruction"
      value={support.isHelpRequest ? support.examiningOrganisation : null}
    />
    <HideIfEmptyInfo
      label="Montant demandé"
      value={support.isHelpRequest ? euros(support.askedAmount) : null}
    />
    <HideIfEmptyInfo
      label="Date d'envoi du dossier"
      value={support.isHelpRequest ? dateAsDay(support.dispatchDate) : null}
    />
    <HideIfEmptyInfo
      label="Date de passage en commission"
      value={support.isHelpRequest ? dateAsDay(support.examinationDate) : null}
    />
    <HideIfEmptyInfo
      label="Date de la décision"
      value={support.isHelpRequest ? dateAsDay(support.decisionDate) : null}
    />
    {support.isHelpRequest && support.status === HelpRequestStatus.Accepted && (
      <>
        <HideIfEmptyInfo
          label="Montant attribué"
          value={getHelpRequestAllocatedAmount(support)}
        />
        <HideIfEmptyInfo
          label="Date de fin de prise en charge"
          value={dateAsDay(support.handlingDate)}
        />
      </>
    )}
    <HideIfEmptyInfo
      label="Motif du refus"
      value={support.isHelpRequest ? support.refusalReason : null}
    />

    {support.isHelpRequest && (
      <li v-if="history.help_request" className="fr-icon-success-line">
        Instruction de demande
      </li>
    )}
    {support.isInterview && (
      <div>
        {support.classified && <li className="fr-icon-success-line">Classé</li>}
        {support.classified && <li className="fr-icon-success-line">Classé</li>}
        {support.forwardedToJustice && (
          <li className="fr-icon-success-line">Transmis à la justice</li>
        )}
        <HideIfEmptyInfo
          label="Interventions"
          value={getFollowupInterventions(support)}
        />
        <HideIfEmptyInfo
          label="Signalements"
          value={getFollowupSignalements(support)}
        />
      </div>
    )}
  </ul>
)
