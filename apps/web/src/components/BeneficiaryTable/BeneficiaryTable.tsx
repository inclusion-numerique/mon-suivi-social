import { beneficiaryColumns } from './beneficiaryColumns'
import { Routes } from '@mss/web/app/routing/routes'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { BeneficiaryList } from '@mss/web/server/query'

export const BeneficiaryTable = ({
  beneficiaries,
}: {
  beneficiaries: BeneficiaryList
}) => {
  if (beneficiaries.length === 0) {
    return (
      <tr>
        <td colSpan={beneficiaryColumns.length}>
          Aucun bénéficiaire ne correspond à votre recherche
        </td>
      </tr>
    )
  }

  return (
    <>
      {beneficiaries.map((beneficiary) => {
        const href = Routes.Beneficiaires.Beneficiaire.Index.path(beneficiary)

        const title = `Fiche bénéficiaire ${
          beneficiary.fileNumber
        }, ${beneficiaryDisplayName(beneficiary)}`

        return (
          <TableRowWithRowLink
            key={beneficiary.id}
            item={beneficiary}
            columns={beneficiaryColumns}
            href={href}
            title={title}
          />
        )
      })}
    </>
  )
}
