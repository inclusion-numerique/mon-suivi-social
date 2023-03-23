import {
  beneficiarySocioProfessionalCategoryLabels,
  incomeSourceLabels,
} from '@mss/web/constants/beneficiary'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { euros } from '@mss/web/utils/euros'
import { Beneficiary, IncomeSource } from '@prisma/client'
import { AttributesList } from '../Generic'

const incomeSourceToIncomeSourceLabel = (incomeSource: IncomeSource[]) =>
  incomeSource ? incomeSource.map((i) => incomeSourceLabels[i]).join(', ') : ''

export function BeneficiaryIncome({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className: string
}) {
  const { fieldLabels } = AddBeneficiaryWithFullDataClient

  return (
    <div className={className}>
      <hr />
      <h3 className="fr-h4">Activité/Revenu</h3>
      <hr />
      <AttributesList
        items={[
          [
            fieldLabels.socioProfessionalCategory || '',
            beneficiary.socioProfessionalCategory
              ? beneficiarySocioProfessionalCategoryLabels[
                  beneficiary.socioProfessionalCategory
                ]
              : null,
          ],
          [fieldLabels.occupation || '', beneficiary.occupation],
          [fieldLabels.employer || '', beneficiary.employer],
          [fieldLabels.employerSiret || '', beneficiary.employerSiret],
          [
            fieldLabels.mainIncomeSource || '',
            incomeSourceToIncomeSourceLabel(beneficiary.mainIncomeSource),
          ],
          [
            fieldLabels.mainIncomeAmount || '',
            beneficiary.mainIncomeAmount
              ? euros(beneficiary.mainIncomeAmount)
              : null,
          ],
          [
            fieldLabels.partnerMainIncomeSource || '',
            incomeSourceToIncomeSourceLabel(
              beneficiary.partnerMainIncomeSource,
            ),
          ],
          [
            fieldLabels.partnerMainIncomeAmount || '',
            beneficiary.partnerMainIncomeAmount
              ? euros(beneficiary.partnerMainIncomeAmount)
              : null,
          ],
          [
            fieldLabels.majorChildrenMainIncomeSource || '',
            incomeSourceToIncomeSourceLabel(
              beneficiary.majorChildrenMainIncomeSource,
            ),
          ],
          [
            fieldLabels.majorChildrenMainIncomeAmount || '',
            euros(beneficiary.majorChildrenMainIncomeAmount),
          ],
          [
            fieldLabels.unemploymentNumber || '',
            beneficiary.unemploymentNumber,
          ],
          [
            fieldLabels.pensionOrganisations || '',
            beneficiary.pensionOrganisations,
          ],
          [fieldLabels.cafNumber || '', beneficiary.cafNumber],
          [fieldLabels.bank || '', beneficiary.bank],
          [fieldLabels.funeralContract || '', beneficiary.funeralContract],
        ]}
      />
    </div>
  )
}
