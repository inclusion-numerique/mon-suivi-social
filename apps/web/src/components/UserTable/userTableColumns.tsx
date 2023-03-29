import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { UserListItem } from '@mss/web/server/query/utilisateurs'
import { UserRoleLabels } from '@mss/web/client/options/user'

export const userTableColumns: TableColumnDefinition<UserListItem>[] = [
  {
    label: 'Nom',
    sortable: (direction) => [{ lastName: direction }],
    content: ({ lastName }) => nonBreakable(lastName),
  },
  {
    label: 'Prénom',
    sortable: (direction) => [{ firstName: direction }],
    content: ({ firstName }) => nonBreakable(firstName),
  },
  {
    label: 'Email',
    sortable: (direction) => [{ email: direction }],
    content: ({ email }) => nonBreakable(email),
  },
  {
    label: 'Rôle',
    sortable: (direction) => [{ role: direction }],
    content: ({ role }) => nonBreakable(UserRoleLabels[role]),
  },
  {
    label: 'Bénéficiaires',
    sortable: (direction) => [{ referentFor: { _count: direction } }],
    content: ({ _count: { referentFor } }) => referentFor,
    options: { justify: 'flex-end', containerClassName: 'fr-pr-5w' },
  },
  {
    label: 'Accès',
    sortable: (direction) => [{ status: direction }],
    content: ({ status }) =>
      status === 'Active' ? (
        <span
          className="fr-badge fr-badge--sm fr-badge--success"
          aria-pressed="true"
        >
          Activé
        </span>
      ) : (
        <span className="fr-badge fr-badge--sm fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-error-line">
          Révoqué
        </span>
      ),
  },
]
