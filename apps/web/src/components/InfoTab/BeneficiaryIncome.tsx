import {
  beneficiarySocioProfessionalCategoryLabels,
  incomeSourceLabels,
} from '@mss/web/client/options/beneficiary'
import { beneficiaryFieldLabels } from '@mss/web/client/labels'
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
  className?: string
}) {
  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <hr />
      <h3 className="fr-h4">Activité/Revenu</h3>
      <hr />
      <AttributesList
        items={[
          [
            beneficiaryFieldLabels.socioProfessionalCategory || '',
            beneficiary.socioProfessionalCategory
              ? beneficiarySocioProfessionalCategoryLabels[
                  beneficiary.socioProfessionalCategory
                ]
              : null,
          ],
          [beneficiaryFieldLabels.occupation || '', beneficiary.occupation],
          [beneficiaryFieldLabels.employer || '', beneficiary.employer],
          [
            beneficiaryFieldLabels.employerSiret || '',
            beneficiary.employerSiret,
          ],
          [
            beneficiaryFieldLabels.mainIncomeSource || '',
            incomeSourceToIncomeSourceLabel(beneficiary.mainIncomeSource),
          ],
          [
            beneficiaryFieldLabels.mainIncomeAmount || '',
            beneficiary.mainIncomeAmount
              ? euros(beneficiary.mainIncomeAmount)
              : null,
          ],
          [
            beneficiaryFieldLabels.partnerMainIncomeSource || '',
            incomeSourceToIncomeSourceLabel(
              beneficiary.partnerMainIncomeSource,
            ),
          ],
          [
            beneficiaryFieldLabels.partnerMainIncomeAmount || '',
            beneficiary.partnerMainIncomeAmount
              ? euros(beneficiary.partnerMainIncomeAmount)
              : null,
          ],
          [
            beneficiaryFieldLabels.majorChildrenMainIncomeSource || '',
            incomeSourceToIncomeSourceLabel(
              beneficiary.majorChildrenMainIncomeSource,
            ),
          ],
          [
            beneficiaryFieldLabels.majorChildrenMainIncomeAmount || '',
            euros(beneficiary.majorChildrenMainIncomeAmount),
          ],
          [
            beneficiaryFieldLabels.unemploymentNumber || '',
            beneficiary.unemploymentNumber,
          ],
          [
            beneficiaryFieldLabels.pensionOrganisations || '',
            beneficiary.pensionOrganisations,
          ],
          [beneficiaryFieldLabels.cafNumber || '', beneficiary.cafNumber],
          [beneficiaryFieldLabels.bank || '', beneficiary.bank],
          [
            beneficiaryFieldLabels.funeralContract || '',
            beneficiary.funeralContract,
          ],
        ]}
      />
    </div>
  )
}
