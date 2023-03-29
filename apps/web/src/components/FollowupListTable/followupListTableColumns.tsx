import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import { getUserDisplayName } from '@mss/web/utils/user'
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import {
  followupMediumLabels,
  followupStatusClasses,
  followupStatusLabels,
} from '@mss/web/constants/followup'
import { FollowupsListItem } from '@mss/web/server/query'

export const followupListTableColumns = [
  {
    label: 'Statut',
    content: ({ status }: FollowupsListItem) => (
      <span
        className={`fr-badge fr-badge--sm ${followupStatusClasses[status]}`}
      >
        {nonBreakable(followupStatusLabels[status])}
      </span>
    ),
  },
  {
    label: "Type d'entretien",
    content: ({ medium }: FollowupsListItem) =>
      nonBreakable(followupMediumLabels[medium]),
  },
  {
    label: "Objets d'entretien",
    content: ({ types }: FollowupsListItem) => (
      <div style={{ marginTop: '-0.25rem', marginLeft: '-0.25rem' }}>
        {types.map(({ name }) => (
          <span key={name} className="fr-tag fr-tag--sm fr-mt-1v fr-ml-1v">
            {nonBreakable(name)}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: "Date d'échéance",
    sortable: (direction) => [{ dueDate: direction }],
    content: ({ dueDate }: FollowupsListItem) => dateAsDay(dueDate),
  },
  {
    label: 'Bénéficiaire',
    sortable: (direction) => [
      { beneficiary: { usualName: direction } },
      { beneficiary: { birthName: direction } },
    ],
    content: ({ beneficiary }: FollowupsListItem) =>
      nonBreakable(beneficiaryDisplayName(beneficiary)),
  },
  {
    label: 'Agent',
    content: ({ createdBy }: FollowupsListItem) =>
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
] satisfies TableColumnDefinition<FollowupsListItem>[]
