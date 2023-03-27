import { beneficiaryGirLabels } from '@mss/web/constants/beneficiary'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { Beneficiary } from '@prisma/client'
import { AttributesList } from '../Generic'

export function BeneficiaryHealth({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
  const { fieldLabels } = AddBeneficiaryWithFullDataClient

  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <hr />
      <h3 className="fr-h4">Santé</h3>
      <hr />
      <AttributesList
        items={[
          [
            fieldLabels.gir || '',
            beneficiary.gir ? beneficiaryGirLabels[beneficiary.gir] : null,
          ],
          [fieldLabels.doctor || '', beneficiary.doctor],
          [
            fieldLabels.socialSecurityNumber || '',
            beneficiary.socialSecurityNumber,
          ],
          [fieldLabels.insurance || '', beneficiary.insurance],
          [
            fieldLabels.healthAdditionalInformation || '',
            beneficiary.healthAdditionalInformation,
          ],
        ]}
      />
    </div>
  )
}
