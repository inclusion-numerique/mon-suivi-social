import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { userTableColumns } from './userTableColumns'
import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { getUserDisplayName } from '@mss/web/utils/user'
import { UserListItem } from '@mss/web/query/utilisateurs'

export const UserTable = asyncComponent(
  async ({ users }: { users: UserListItem[] }) => {
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={userTableColumns.length}>
            Aucun utilisateur ne correspond à votre recherche
          </td>
        </tr>
      )
    }

    return (
      <>
        {users.map((user) => {
          const href = Routes.Utilisateurs.Modifier.path({ userId: user.id })

          const title = `Modifier l'utilisateur ${getUserDisplayName(user)}`

          return (
            <TableRowWithRowLink
              key={user.id}
              item={user}
              columns={userTableColumns}
              href={href}
              title={title}
            />
          )
        })}
      </>
    )
  },
)
