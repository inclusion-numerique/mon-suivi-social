import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { HelpRequestsList } from '@mss/web/query'
import { helpRequestListTableColumns } from './helpRequestListTableColumns'

export const HelpRequestListTableRows = ({
  helpRequests,
}: {
  helpRequests: HelpRequestsList
}) => {
  if (helpRequests.length === 0) {
    return (
      <tr>
        <td colSpan={helpRequestListTableColumns.length}>
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
            columns={helpRequestListTableColumns}
            href={href}
            title={title}
          />
        )
      })}
    </>
  )
}
