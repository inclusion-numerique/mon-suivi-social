import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import { ListStructuresItem } from '@mss/web/features/structure/listStructures/listStructures.server'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { StructureTypeLabels } from '@mss/web/features/structure/createStructure/createStructure.client'

export const structuresListTableColumns = [
  {
    label: 'Nom',
    sortable: (direction) => [{ name: direction }],
    content: ({ name }: ListStructuresItem) => nonBreakable(name),
  },
  {
    label: 'Type',
    sortable: (direction) => [{ type: direction }],
    content: ({ type }: ListStructuresItem) =>
      nonBreakable(StructureTypeLabels[type]),
  },
  {
    label: 'Utilisateurs',
    sortable: (direction) => [{ users: { _count: direction } }],
    content: ({ _count: { users } }: ListStructuresItem) => users,
  },
  {
    label: 'Bénéficiaires',
    sortable: (direction) => [{ beneficiaries: { _count: direction } }],
    content: ({ _count: { beneficiaries } }: ListStructuresItem) =>
      beneficiaries,
  },
  {
    label: 'Entretiens',
    sortable: (direction) => [{ followups: { _count: direction } }],
    content: ({ _count: { followups } }: ListStructuresItem) => followups,
  },
  {
    label: "Demandes d'aide",
    sortable: (direction) => [{ helpRequests: { _count: direction } }],
    content: ({ _count: { helpRequests } }: ListStructuresItem) => helpRequests,
  },
  {
    label: 'Ville',
    content: ({ city, zipcode }: ListStructuresItem) =>
      zipcode ? nonBreakable(`${city ?? ''} (${zipcode})`).trim() : city,
  },
  {
    label: 'Email',
    content: ({ email }: ListStructuresItem) => email,
  },
  {
    label: 'Téléphone',
    content: ({ phone }: ListStructuresItem) => nonBreakable(phone),
  },
] satisfies TableColumnDefinition<ListStructuresItem>[]
