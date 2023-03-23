import { Beneficiary } from '@prisma/client'

export function BeneficiaryRelatives({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className: string
}) {
  return (
    <div className={className}>
      <hr />
      <h3 className="fr-h4">Entourage</h3>
      <hr />
      {/* TODO */}
    </div>
  )
}
