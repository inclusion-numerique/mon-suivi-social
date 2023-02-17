import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { ListUsersItem } from '@mss/web/features/user/listUsers/listUsers.server'
import { usersListTableColumns } from '@mss/web/app/(private)/utilisateurs/(liste)/usersListTableColumns'
import { TableRow } from '@mss/web/ui/table/TableRow'

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
          return (
            <TableRow
              key={user.id}
              item={user}
              columns={usersListTableColumns}
            />
          )
        })}
      </>
    )
  },
)
