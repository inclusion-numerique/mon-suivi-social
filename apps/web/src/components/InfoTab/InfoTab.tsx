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
      <BeneficiaryGeneralInformation beneficiary={beneficiary} />
      {canViewFullInfo ? (
        <BeneficiaryHousehold beneficiary={beneficiary} />
      ) : null}
      {canViewFullInfo ? (
        <BeneficiaryRelatives beneficiary={beneficiary} />
      ) : null}
      {canViewFullInfo ? <BeneficiaryHealth beneficiary={beneficiary} /> : null}
      {canViewFullInfo ? <BeneficiaryIncome beneficiary={beneficiary} /> : null}
      {canViewFullInfo ? (
        <BeneficiaryExternalOrganisations beneficiary={beneficiary} />
      ) : null}
      <BeneficiaryAdditionalInformation beneficiary={beneficiary} />
    </div>
  )
}
