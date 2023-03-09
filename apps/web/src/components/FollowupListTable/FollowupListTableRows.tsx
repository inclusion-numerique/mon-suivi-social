import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { FollowupsList } from '@mss/web/query'
import { followupListTableColumns } from './followupListTableColumns'

export const FollowupListTableRows = ({
  followups,
}: {
  followups: FollowupsList
}) => {
  if (followups.length === 0) {
    return (
      <tr>
        <td colSpan={followupListTableColumns.length}>
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
            columns={followupListTableColumns}
            href={href}
            title={title}
          />
        )
      })}
    </>
  )
}
