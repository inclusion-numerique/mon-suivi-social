import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/ui/table/TableRowWithRowLink'
import type { QueryResult } from '@mss/web/features/createQuery.server'
import { ListFollowupsServer } from '@mss/web/features/followup/listFollowups/listFollowups.server'
import { FollowupListTableColumns } from './FollowupListTableColumns'

export const FollowupListTableRows = asyncComponent(
  async ({
    followups,
  }: Pick<QueryResult<typeof ListFollowupsServer>, 'followups'>) => {
    if (followups.length === 0) {
      return (
        <tr>
          <td colSpan={FollowupListTableColumns.length}>
            Aucun entretien ne correspond à votre recherche
          </td>
        </tr>
      )
    }

    return (
      <>
        {followups.map((followup) => {
          const href = Routes.Beneficiaires.Beneficiaire.Index.path(
            { fileNumber: followup.beneficiary.fileNumber },
            { tab: 'historique', accompagnement: followup.id },
          )

          const title = `Voir l'entretien`

          return (
            <TableRowWithRowLink
              key={followup.id}
              item={followup}
              columns={FollowupListTableColumns}
              href={href}
              title={title}
            />
          )
        })}
      </>
    )
  },
)
