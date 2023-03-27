import {
  beneficiaryOrientationTypeLabels,
  beneficiaryProtectionMeasureLabels,
} from '@mss/web/constants/beneficiary'
import { beneficiaryFieldLabels } from '@mss/web/field-label'
import { Beneficiary } from '@prisma/client'
import { AttributesList } from '../Generic'

export function BeneficiaryExternalOrganisations({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <hr />
      <h3 className="fr-h4">Structures extérieures</h3>
      <hr />
      <AttributesList
        items={[
          [
            beneficiaryFieldLabels.protectionMeasure || '',
            beneficiary.protectionMeasure
              ? beneficiaryProtectionMeasureLabels[
                  beneficiary.protectionMeasure
                ]
              : null,
          ],
          [
            beneficiaryFieldLabels.representative || '',
            beneficiary.representative,
          ],
          [
            beneficiaryFieldLabels.prescribingStructure || '',
            beneficiary.prescribingStructure,
          ],
          [
            beneficiaryFieldLabels.orientationType || '',
            beneficiary.orientationType
              ? beneficiaryOrientationTypeLabels[beneficiary.orientationType]
              : null,
          ],
          [
            beneficiaryFieldLabels.orientationStructure || '',
            beneficiary.orientationStructure,
          ],
          [
            beneficiaryFieldLabels.serviceProviders || '',
            beneficiary.serviceProviders,
          ],
          [
            beneficiaryFieldLabels.involvedPartners || '',
            beneficiary.involvedPartners,
          ],
        ]}
      />
    </div>
  )
}
