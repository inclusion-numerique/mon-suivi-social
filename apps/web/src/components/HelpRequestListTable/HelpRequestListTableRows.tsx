import { Routes } from '@mss/web/app/routing/routes'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { HelpRequestsList } from '@mss/web/query'
import { canAccessProtectedDataInHelpRequest } from '@mss/web/security/rules'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { helpRequestListTableColumns } from './helpRequestListTableColumns'

export const HelpRequestListTableRows = ({
  serializedUser,
  helpRequests,
}: {
  serializedUser: Serialized<SessionUser>
  helpRequests: HelpRequestsList
}) => {
  const user = deserialize(serializedUser)
  const accessibleColumns = helpRequestListTableColumns.filter(
    ({ isProtected }) =>
      !isProtected || canAccessProtectedDataInHelpRequest(user),
  )

  if (helpRequests.length === 0) {
    return (
      <tr>
        <td colSpan={accessibleColumns.length}>
          Aucune demande d&apos;aide ne correspond à votre recherche
        </td>
      </tr>
    )
  }

  return (
    <>
      {helpRequests.map((helpRequest) => {
        const href = Routes.Beneficiaires.Beneficiaire.Index.path(
          { fileNumber: helpRequest.beneficiary.fileNumber },
          { tab: 'historique', accompagnement: helpRequest.id },
        )

        const title = `Voir la demande d'aide`

        return (
          <TableRowWithRowLink
            key={helpRequest.id}
            item={helpRequest}
            columns={accessibleColumns}
            href={href}
            title={title}
          />
        )
      })}
    </>
  )
}
