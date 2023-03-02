import { beneficiaryColumns } from './beneficiaryColumns'
import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { Routes } from '@mss/web/app/routing/routes'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { TableRowWithRowLink } from '@mss/web/ui/table/TableRowWithRowLink'
import { ListBeneficiariesServer } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.server'
import type { QueryResult } from '@mss/web/features/createQuery.server'

export const BeneficiaryTable = asyncComponent(
  async ({
    beneficiaries,
  }: Pick<QueryResult<typeof ListBeneficiariesServer>, 'beneficiaries'>) => {
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
