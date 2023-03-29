import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { StructuresListItem } from '@mss/web/server/query/structure'
import { StructureTypeLabels } from '@mss/web/client/options/structure'

export const structureColumns = [
  {
    label: 'Nom',
    sortable: (direction) => [{ name: direction }],
    content: ({ name }: StructuresListItem) => nonBreakable(name),
  },
  {
    label: 'Type',
    sortable: (direction) => [{ type: direction }],
    content: ({ type }: StructuresListItem) =>
      nonBreakable(StructureTypeLabels[type]),
  },
  {
    label: 'Utilisateurs',
    sortable: (direction) => [{ users: { _count: direction } }],
    content: ({ _count: { users } }: StructuresListItem) => users,
  },
  {
    label: 'Bénéficiaires',
    sortable: (direction) => [{ beneficiaries: { _count: direction } }],
    content: ({ _count: { beneficiaries } }: StructuresListItem) =>
      beneficiaries,
  },
  {
    label: 'Entretiens',
    sortable: (direction) => [{ followups: { _count: direction } }],
    content: ({ _count: { followups } }: StructuresListItem) => followups,
  },
  {
    label: "Demandes d'aide",
    sortable: (direction) => [{ helpRequests: { _count: direction } }],
    content: ({ _count: { helpRequests } }: StructuresListItem) => helpRequests,
  },
  {
    label: 'Ville',
    content: ({ city, zipcode }: StructuresListItem) =>
      zipcode ? nonBreakable(`${city ?? ''} (${zipcode})`).trim() : city,
  },
  {
    label: 'Email',
    content: ({ email }: StructuresListItem) => email,
  },
  {
    label: 'Téléphone',
    content: ({ phone }: StructuresListItem) => nonBreakable(phone),
  },
] satisfies TableColumnDefinition<StructuresListItem>[]
