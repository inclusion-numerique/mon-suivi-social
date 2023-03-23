import { Beneficiary } from '@prisma/client'

export function BeneficiaryHousehold({
  beneficiary,
  className,
}: {
  beneficiary: Beneficiary
  className: string
}) {
  return (
    <div className={className}>
      <hr />
      <h3 className="fr-h4">Foyer fiscal</h3>
      <hr />
      {/* TODO */}
    </div>
  )
}
