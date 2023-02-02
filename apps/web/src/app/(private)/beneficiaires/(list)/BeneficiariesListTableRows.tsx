import { beneficiariesListTableColumns } from '@mss/web/app/(private)/beneficiaires/(list)/beneficiariesListTableColumns'
import { ListBeneficiariesFeature } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.server'
import { ListBeneficiariesFeatureClient } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.client'
import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { Routes } from '@mss/web/app/routing/routes'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { TableRowWithRowLink } from '@mss/web/ui/table/TableRowWithRowLink'

export const BeneficiariesListTableRows = asyncComponent(
  async ({
    queryInput,
  }: {
    queryInput: ListBeneficiariesFeatureClient.Input
  }) => {
    const { beneficiaries } = await ListBeneficiariesFeature.executeQuery({
      queryInput,
    })

    if (beneficiaries.length === 0) {
      return (
        <tr>
          <td colSpan={beneficiariesListTableColumns.length}>
            Aucun bénéficiaire ne correspond à votre recherche
          </td>
        </tr>
      )
    }

    return (
      <>
        {beneficiaries.map((beneficiary) => {
          const href =
            Routes.Structure.Beneficiaires.Beneficiaire.Index.path(beneficiary)

          const title = `Fiche bénéficiaire ${
            beneficiary.fileNumber
          }, ${beneficiaryDisplayName(beneficiary)}`

          return (
            <TableRowWithRowLink
              key={beneficiary.id}
              item={beneficiary}
              columns={beneficiariesListTableColumns}
              href={href}
              title={title}
            />
          )
        })}
      </>
    )
  },
)
