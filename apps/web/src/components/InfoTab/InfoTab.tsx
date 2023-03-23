import { Beneficiary, FollowupType, User } from '@prisma/client'
import { BeneficiaryGeneralInformation } from './BeneficiaryGeneralInformation'
import { BeneficiaryHousehold } from './BeneficiaryHousehold'
import { BeneficiaryRelatives } from './BeneficiaryRelatives'
import { BeneficiaryHealth } from './BeneficiaryHealth'
import { BeneficiaryIncome } from './BeneficiaryIncome'
import { BeneficiaryExternalOrganisations } from './BeneficiaryExternalOrganisations'
import { BeneficiaryAdditionalInformation } from './BeneficiaryAdditionalInformation'
import { SessionUserAgent } from '@mss/web/auth/sessionUser'
import { canViewBeneficiaryFullInfo } from '@mss/web/security/rules'

export function InfoTab({
  user,
  beneficiary,
  followupTypes,
}: {
  user: SessionUserAgent
  beneficiary: Beneficiary & { referents: User[] }
  followupTypes: FollowupType[]
}) {
  const canViewFullInfo = canViewBeneficiaryFullInfo(user, beneficiary)

  return (
    // TODO: Types d'accompagnements ?
    <div className="fr-grid-row fr-grid-row--gutters">
      <BeneficiaryGeneralInformation
        beneficiary={beneficiary}
        className="fr-col-12 fr-mb-2w fr-p-9v"
      />
      {canViewFullInfo ? (
        <BeneficiaryHousehold
          beneficiary={beneficiary}
          className="fr-col-12 fr-mb-2w fr-p-9v"
        />
      ) : null}
      {canViewFullInfo ? (
        <BeneficiaryRelatives
          beneficiary={beneficiary}
          className="fr-col-12 fr-mb-2w fr-p-9v"
        />
      ) : null}
      {canViewFullInfo ? (
        <BeneficiaryHealth
          beneficiary={beneficiary}
          className="fr-col-12 fr-mb-2w fr-p-9v"
        />
      ) : null}
      {canViewFullInfo ? (
        <BeneficiaryIncome
          beneficiary={beneficiary}
          className="fr-col-12 fr-mb-2w fr-p-9v"
        />
      ) : null}
      {canViewFullInfo ? (
        <BeneficiaryExternalOrganisations
          beneficiary={beneficiary}
          className="fr-col-12 fr-mb-2w fr-p-9v"
        />
      ) : null}
      <BeneficiaryAdditionalInformation
        beneficiary={beneficiary}
        className="fr-col-12 fr-mb-2w fr-p-9v"
      />
    </div>
  )
}
