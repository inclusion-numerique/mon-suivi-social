import { beneficiaryGirLabels } from '@mss/web/client/options/beneficiary'
import { beneficiaryFieldLabels } from '@mss/web/client/labels'
import { Beneficiary } from '@prisma/client'
import { AttributesList } from '../Generic'

export function BeneficiaryHealth({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <hr />
      <h3 className="fr-h4">Santé</h3>
      <hr />
      <AttributesList
        items={[
          [
            beneficiaryFieldLabels.gir || '',
            beneficiary.gir ? beneficiaryGirLabels[beneficiary.gir] : null,
          ],
          [beneficiaryFieldLabels.doctor || '', beneficiary.doctor],
          [
            beneficiaryFieldLabels.socialSecurityNumber || '',
            beneficiary.socialSecurityNumber,
          ],
          [beneficiaryFieldLabels.insurance || '', beneficiary.insurance],
          [
            beneficiaryFieldLabels.healthAdditionalInformation || '',
            beneficiary.healthAdditionalInformation,
          ],
        ]}
      />
    </div>
  )
}
