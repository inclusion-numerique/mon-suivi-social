import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/ui/table/TableRowWithRowLink'
import type { QueryResult } from '@mss/web/features/createQuery.server'
import { helpRequestListTableColumns } from './helpRequestListTableColumns'
import { ListHelpRequestsServer } from '@mss/web/features/followup/listHelpRequests/listHelpRequests.server'

export const HelpRequestListTableRows = asyncComponent(
  async ({
    helpRequests,
  }: Pick<QueryResult<typeof ListHelpRequestsServer>, 'helpRequests'>) => {
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
  },
)
