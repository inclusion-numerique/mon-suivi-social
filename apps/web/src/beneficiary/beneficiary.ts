import { Beneficiary, BeneficiaryStatus } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'

export const beneficiaryStatusLabels: { [key in BeneficiaryStatus]: string } = {
  [BeneficiaryStatus.Active]: 'Actif',
  [BeneficiaryStatus.Inactive]: 'Inactif',
  [BeneficiaryStatus.Archived]: 'Archivé',
  [BeneficiaryStatus.Deceased]: 'Décédé·e',
}

export const beneficiaryStatusOptions = labelsToOptions(beneficiaryStatusLabels)

export const beneficiaryDisplayName = ({
  firstName,
  birthName,
  usualName,
  fileNumber,
}: Pick<
  Beneficiary,
  'firstName' | 'usualName' | 'birthName' | 'fileNumber'
>): string => {
  if (!firstName && !birthName && !usualName) {
    return `n°${fileNumber}`
  }

  if (usualName) {
    return `${firstName} ${usualName}`.trim()
  }
  return `${firstName} ${birthName}`.trim()
}
