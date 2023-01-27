import { LabelAndValue } from '@mss/web/ui/LabelAndValue'
import { getAge } from '@mss/web/utils/age'
import { SessionUser } from '@mss/web/auth/sessionUser'
import type { BeneficiaryPageInfo } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'

export const InfoTab = ({
  user,
  beneficiary,
}: {
  user: SessionUser
  beneficiary: BeneficiaryPageInfo
}) => {
  return (
    <>
      <h4>Bénéficiaire</h4>
      <ul className="fr-raw-list">
        <LabelAndValue value={beneficiary.title}>Civilité</LabelAndValue>
        <LabelAndValue value={beneficiary.firstName}>Prénom</LabelAndValue>
        <LabelAndValue value={beneficiary.usualName}>Nom usuel</LabelAndValue>
        <LabelAndValue value={beneficiary.birthName}>
          Nom de naissance
        </LabelAndValue>
        <LabelAndValue value={beneficiary.birthDate?.toLocaleDateString()}>
          Date de naissance
        </LabelAndValue>
        <LabelAndValue
          value={beneficiary.birthDate ? getAge(beneficiary.birthDate) : null}
        >
          Age
        </LabelAndValue>
      </ul>
    </>
  )
}
