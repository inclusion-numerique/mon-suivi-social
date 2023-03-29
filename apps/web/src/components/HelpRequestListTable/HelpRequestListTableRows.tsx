import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { HelpRequestsList, HelpRequestsListItem } from '@mss/web/server/query'
import { TableColumnDefinition } from '../Generic'

export const HelpRequestListTableRows = ({
  columns,
  helpRequests,
}: {
  columns: TableColumnDefinition<HelpRequestsListItem>[]
  helpRequests: HelpRequestsList
}) => {
  if (helpRequests.length === 0) {
    return (
      <tr>
        <td colSpan={columns.length}>
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
            columns={columns}
            href={href}
            title={title}
          />
        )
      })}
    </>
  )
}
