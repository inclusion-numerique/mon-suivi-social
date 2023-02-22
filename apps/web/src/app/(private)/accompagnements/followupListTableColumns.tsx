import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import { ListFollowupsItem } from '@mss/web/features/followup/listFollowups/listFollowups.server'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import {
  followupMediumLabels,
  followupStatusClasses,
  followupStatusLabels,
} from '@mss/web/features/followup/addFollowup.client'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { getUserDisplayName } from '@mss/web/utils/user'
import { dateAsDay } from '@mss/web/utils/dateAsDay'

export const followupListTableColumns = [
  {
    label: 'Statut',
    content: ({ status }: ListFollowupsItem) => (
      <span
        className={`fr-badge fr-badge--sm ${followupStatusClasses[status]}`}
      >
        {nonBreakable(followupStatusLabels[status])}
      </span>
    ),
  },
  {
    label: "Type d'entretien",
    content: ({ medium }: ListFollowupsItem) =>
      nonBreakable(followupMediumLabels[medium]),
  },
  {
    label: "Types d'accompagnement",
    content: ({ types }: ListFollowupsItem) => (
      <div style={{ marginTop: '-0.25rem', marginLeft: '-0.25rem' }}>
        {types.map(({ name }) => (
          <span className="fr-tag fr-tag--sm fr-mt-1v fr-ml-1v">
            {nonBreakable(name)}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: "Date d'échéance",
    sortable: (direction) => [{ dueDate: direction }],
    content: ({ dueDate }: ListFollowupsItem) => dateAsDay(dueDate),
  },
  {
    label: 'Bénéficiaire',
    sortable: (direction) => [
      { beneficiary: { usualName: direction } },
      { beneficiary: { birthName: direction } },
    ],
    content: ({ beneficiary }: ListFollowupsItem) =>
      nonBreakable(beneficiaryDisplayName(beneficiary)),
  },
  {
    label: 'Agent',
    content: ({ createdBy }: ListFollowupsItem) =>
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
] satisfies TableColumnDefinition<ListFollowupsItem>[]
