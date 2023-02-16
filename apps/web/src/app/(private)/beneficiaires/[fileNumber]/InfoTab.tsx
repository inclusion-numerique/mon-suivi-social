import { getAge } from '@mss/web/utils/age'
import { SessionUser } from '@mss/web/auth/sessionUser'
import type { BeneficiaryPageInfo } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { AttributesList } from '@mss/web/ui/AttributesList'
import { beneficiaryTitleLabels } from '@mss/web/beneficiary/beneficiary'
import { formatDate } from '@mss/web/utils/formatDate'

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
      <AttributesList
        items={[
          beneficiary.title
            ? ['Civilité', beneficiaryTitleLabels[beneficiary.title]]
            : undefined,
          ['Prénom', beneficiary.firstName],
          ['Nom usuel', beneficiary.usualName],
          ['Nom de naissance', beneficiary.birthName],
          ['Age', beneficiary.birthDate ? getAge(beneficiary.birthDate) : null],
          ['Date de naissance', formatDate(beneficiary.birthDate)],
        ]}
      />
    </>
  )
}
