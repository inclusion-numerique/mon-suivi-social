import {
  beneficiaryOrientationTypeLabels,
  beneficiaryProtectionMeasureLabels,
} from '@mss/web/constants/beneficiary'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { Beneficiary } from '@prisma/client'
import { AttributesList } from '../Generic'

export function BeneficiaryExternalOrganisations({
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
      <h3 className="fr-h4">Structures extérieures</h3>
      <hr />
      <AttributesList
        items={[
          [
            fieldLabels.protectionMeasure || '',
            beneficiary.protectionMeasure
              ? beneficiaryProtectionMeasureLabels[
                  beneficiary.protectionMeasure
                ]
              : null,
          ],
          [fieldLabels.representative || '', beneficiary.representative],
          [
            fieldLabels.prescribingStructure || '',
            beneficiary.prescribingStructure,
          ],
          [
            fieldLabels.orientationType || '',
            beneficiary.orientationType
              ? beneficiaryOrientationTypeLabels[beneficiary.orientationType]
              : null,
          ],
          [
            fieldLabels.orientationStructure || '',
            beneficiary.orientationStructure,
          ],
          [fieldLabels.serviceProviders || '', beneficiary.serviceProviders],
          [fieldLabels.involvedPartners || '', beneficiary.involvedPartners],
        ]}
      />
    </div>
  )
}
