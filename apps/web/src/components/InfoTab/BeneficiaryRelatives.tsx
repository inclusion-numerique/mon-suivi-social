import { Beneficiary } from '@prisma/client'

export function BeneficiaryRelatives({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className?: string
}) {
  return (
    <div className={`fr-col-12 fr-mb-2w fr-p-9v ${className}`}>
      <hr />
      <h3 className="fr-h4">Entourage</h3>
      <hr />
      {/* TODO */}
    </div>
  )
}
