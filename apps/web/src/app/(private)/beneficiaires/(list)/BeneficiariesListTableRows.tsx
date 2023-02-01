import { beneficiariesListTableColumns } from '@mss/web/app/(private)/beneficiaires/(list)/beneficiariesListTableColumns'
import { ListBeneficiariesFeature } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.server'
import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { ListBeneficiariesFeatureClient } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.client'
import { asyncComponent } from '@mss/web/utils/asyncComponent'
import styles from '@mss/web/app/(private)/beneficiaires/(list)/TableRow.module.css'
import Link from 'next/link'
import { Routes } from '@mss/web/app/routing/routes'

export const BeneficiariesListTableRows = asyncComponent(
  async ({
    queryInput,
    user,
  }: {
    queryInput: ListBeneficiariesFeatureClient.Input
    user: SecurityRuleGrantee
  }) => {
    const { beneficiaries } = await ListBeneficiariesFeature.executeQuery({
      queryInput,
      user,
    })

    return (
      <>
        {beneficiaries.map((beneficiary) => (
          <tr key={beneficiary.id} className={styles.row}>
            {beneficiariesListTableColumns.map(({ content, label }, index) => (
              // Only allow tab navigation row to row so you can navigate with tab and enter
              // We use Links for accessibility, open in new tab, keyboard nav, ... that onClick does not provide
              <td
                key={label}
                tabIndex={index > 0 ? -1 : undefined}
                className="fr-p-0"
              >
                <Link
                  className={`fr-raw-link fr-p-2v ${styles.cellLink}`}
                  href={Routes.Structure.Beneficiaires.Beneficiaire.Index.path(
                    beneficiary,
                  )}
                >
                  {content(beneficiary)}
                </Link>
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  },
)
