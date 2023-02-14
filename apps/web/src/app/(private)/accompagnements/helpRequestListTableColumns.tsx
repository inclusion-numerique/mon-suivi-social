import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { getUserDisplayName } from '@mss/web/utils/user'
import { ListHelpRequestsItem } from '@mss/web/features/followup/listHelpRequests/listHelpRequests.server'
import {
  helpRequestStatusBadgeClasses,
  helpRequestStatusLabels,
} from '@mss/web/features/helpRequest/addHelpRequest.client'

export const helpRequestListTableColumns = [
  {
    label: 'Statut',
    content: ({ status }: ListHelpRequestsItem) => (
      <span
        className={`fr-badge fr-badge--sm ${helpRequestStatusBadgeClasses[status]}`}
      >
        {nonBreakable(helpRequestStatusLabels[status])}
      </span>
    ),
  },
  {
    label: "Type d'accompagnement",
    content: ({ type: { name } }: ListHelpRequestsItem) => (
      <span className="fr-tag fr-tag--sm fr-mr-1w">{nonBreakable(name)}</span>
    ),
  },
  {
    label: "Date d'échéance",
    sortable: (direction) => [{ dueDate: direction }],
    content: ({ dueDate }: ListHelpRequestsItem) =>
      dueDate?.toLocaleDateString(),
  },
  {
    label: 'Bénéficiaire',
    sortable: (direction) => [
      { beneficiary: { usualName: direction } },
      { beneficiary: { birthName: direction } },
    ],
    content: ({ beneficiary }: ListHelpRequestsItem) =>
      nonBreakable(beneficiaryDisplayName(beneficiary)),
  },
  {
    label: 'Organisme instructeur',
    sortable: (direction) => [{ examiningOrganisation: direction }],
    content: ({ examiningOrganisation }: ListHelpRequestsItem) =>
      nonBreakable(examiningOrganisation),
  },
  {
    label: 'Date de passage en commission',
    sortable: (direction) => [{ examinationDate: direction }],
    content: ({ examinationDate }: ListHelpRequestsItem) =>
      examinationDate?.toLocaleDateString(),
  },
  {
    label: 'Montant demandé',
    sortable: (direction) => [{ askedAmount: direction }],
    content: ({ askedAmount }: ListHelpRequestsItem) => askedAmount?.toString(),
  },
  {
    label: 'Montant attribué',
    sortable: (direction) => [{ allocatedAmount: direction }],
    content: ({ allocatedAmount }: ListHelpRequestsItem) =>
      allocatedAmount?.toString(),
  },
  {
    label: 'Date du paiement',
    sortable: (direction) => [{ paymentDate: direction }],
    content: ({ paymentDate }: ListHelpRequestsItem) =>
      paymentDate?.toLocaleDateString(),
  },
  {
    label: 'Date de fin de prise en charge',
    sortable: (direction) => [{ handlingDate: direction }],
    content: ({ handlingDate }: ListHelpRequestsItem) =>
      handlingDate?.toLocaleDateString(),
  },
  {
    label: 'Agent',
    content: ({ createdBy }: ListHelpRequestsItem) =>
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
] satisfies TableColumnDefinition<ListHelpRequestsItem>[]
