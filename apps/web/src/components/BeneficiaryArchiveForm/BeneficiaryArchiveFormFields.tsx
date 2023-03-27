'use client'

import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Beneficiary } from '@prisma/client'
import { CheckboxFormField } from '@mss/web/components/FormField'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import { Control } from 'react-hook-form'

export const BeneficiaryArchiveFormFields = ({
  serializedBeneficiary,
  control,
}: {
  serializedBeneficiary: Serialized<Beneficiary>
  control: Control<any, any>
}) => {
  const beneficiary = deserialize(serializedBeneficiary)
  return (
    <div>
      <div className="fr-alert fr-alert--warning fr-mb-8v">
        <h3 className="fr-alert__title">Archivage d&apos;un bénéficiaire</h3>
        <p>
          Conformément à la RGPD, l&apos;archivage d&apos;un bénéficiaire
          supprime toutes ses informations personnelles.
        </p>
        <p>
          Cette opération n&apos;est pas réversible et les données ne pourront
          en aucun cas être récupérées.
        </p>
      </div>
      <CheckboxFormField
        checkboxLabel={`Confirmer l'archivage de ${beneficiaryDisplayName(
          beneficiary,
        )}`}
        control={control}
        path="confirm"
      />
    </div>
  )
}
