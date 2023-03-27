import { TableColumnDefinition } from '@mss/web/components/Generic'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import {
  helpRequestStatusBadgeClasses,
  helpRequestStatusLabels,
} from '@mss/web/constants/helpRequest'
import { HelpRequestsListItem } from '@mss/web/query'
import {
  SecurityRuleGrantee,
  canAccessProtectedDataInHelpRequest,
} from '@mss/web/security/rules'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { getUserDisplayName } from '@mss/web/utils/user'

export const buildHelpRequestListTableColumns = (
  grantee: SecurityRuleGrantee,
) => {
  const canAccessProtectedData = canAccessProtectedDataInHelpRequest(grantee)

  const columns: TableColumnDefinition<HelpRequestsListItem>[] = [
    {
      label: 'Statut',
      content: ({ status }: HelpRequestsListItem) => (
        <span
          className={`fr-badge fr-badge--sm ${helpRequestStatusBadgeClasses[status]}`}
        >
          {nonBreakable(helpRequestStatusLabels[status])}
        </span>
      ),
    },
    {
      label: 'Objet de la demande',
      content: ({ type: { name } }: HelpRequestsListItem) => (
        <span className="fr-tag fr-tag--sm fr-mr-1w">{nonBreakable(name)}</span>
      ),
    },
  ]

  if (canAccessProtectedData) {
    columns.push({
      label: "Date d'échéance",
      sortable: (direction) => [{ dueDate: direction }],
      content: ({ dueDate }: HelpRequestsListItem) => dateAsDay(dueDate),
    })
  }

  columns.push({
    label: 'Bénéficiaire',
    sortable: (direction) => [
      { beneficiary: { usualName: direction } },
      { beneficiary: { birthName: direction } },
    ],
    content: ({ beneficiary }: HelpRequestsListItem) =>
      nonBreakable(beneficiaryDisplayName(beneficiary)),
  })

  if (canAccessProtectedData) {
    columns.push(
      {
        label: 'Organisme instructeur',
        sortable: (direction) => [{ examiningOrganisation: direction }],
        content: ({ examiningOrganisation }: HelpRequestsListItem) =>
          nonBreakable(examiningOrganisation),
      },
      {
        label: 'Date de passage en commission',
        sortable: (direction) => [{ examinationDate: direction }],
        content: ({ examinationDate }: HelpRequestsListItem) =>
          dateAsDay(examinationDate),
      },
      {
        label: 'Montant demandé',
        sortable: (direction) => [{ askedAmount: direction }],
        content: ({ askedAmount }: HelpRequestsListItem) =>
          askedAmount?.toString(),
      },
      {
        label: 'Montant attribué',
        sortable: (direction) => [{ allocatedAmount: direction }],
        content: ({ allocatedAmount }: HelpRequestsListItem) =>
          allocatedAmount?.toString(),
      },
      {
        label: 'Date du paiement',
        sortable: (direction) => [{ paymentDate: direction }],
        content: ({ paymentDate }: HelpRequestsListItem) =>
          dateAsDay(paymentDate),
      },
      {
        label: 'Date de fin de prise en charge',
        sortable: (direction) => [{ handlingDate: direction }],
        content: ({ handlingDate }: HelpRequestsListItem) =>
          dateAsDay(handlingDate),
      },
    )
  }

  columns.push(
    {
      label: 'Agent',
      content: ({ createdBy }: HelpRequestsListItem) =>
        createdBy ? nonBreakable(getUserDisplayName(createdBy)) : '',
    },
    {
      label: 'N° de dossier',
      content: ({ beneficiary: { fileNumber } }) => (
        <span className="fr-badge fr-badge--sm fr-badge--blue-cumulus">
          {fileNumber}
        </span>
      ),
    },
  )

  return columns
}
