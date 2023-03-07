import { beneficiaryColumns } from './beneficiaryColumns'
import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { Routes } from '@mss/web/app/routing/routes'
import { beneficiaryDisplayName } from '@mss/web/constants/beneficiary'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { IterateBeneficiariesReturn } from '@mss/web/query'

export const BeneficiaryTable = asyncComponent(
  async ({
    beneficiaries,
  }: Pick<IterateBeneficiariesReturn, 'beneficiaries'>) => {
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
  },
)
