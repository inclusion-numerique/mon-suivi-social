import { isEmptyValue } from '@mss/web/utils/isEmptyValue'
import { Beneficiary } from '@prisma/client'

export function BeneficiaryAdditionalInformation({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <hr />
      <h3 className="fr-h4">Informations complémentaires</h3>
      <hr />
      <p>
        {isEmptyValue(beneficiary.additionalInformation)
          ? 'Aucune information complémentaire renseignée.'
          : beneficiary.additionalInformation}
      </p>
    </div>
  )
}
