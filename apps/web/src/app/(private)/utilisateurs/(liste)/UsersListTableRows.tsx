import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { ListUsersItem } from '@mss/web/features/user/listUsers/listUsers.server'
import { usersListTableColumns } from '@mss/web/app/(private)/utilisateurs/(liste)/usersListTableColumns'
import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/ui/table/TableRowWithRowLink'
import { getUserDisplayName } from '@mss/web/utils/user'

export const UsersListTableRows = asyncComponent(
  async ({ users }: { users: ListUsersItem[] }) => {
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={usersListTableColumns.length}>
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
              columns={usersListTableColumns}
              href={href}
              title={title}
            />
          )
        })}
      </>
    )
  },
)
