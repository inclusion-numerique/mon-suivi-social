import { PartialBy } from '@mss/web/utils/types'
import { Beneficiary } from '@prisma/client'
import { beneficiaryTitleLabels } from '@mss/web/client/options/beneficiary'

const nameOrEmpty = (name: string | null) => name || '(non renseigné)'

export const beneficiaryDisplayName = (
  {
    firstName,
    birthName,
    usualName,
    fileNumber,
    title,
  }: PartialBy<
    Pick<
      Beneficiary,
      'firstName' | 'birthName' | 'usualName' | 'fileNumber' | 'title'
    >,
    'title'
  >,
  withTitle?: boolean,
): string => {
  if (!firstName && !birthName && !usualName) {
    return `n°${fileNumber}`
  }

  const lastname = usualName || (birthName ? `(${birthName})` : '')
  const titleLabel =
    withTitle && title ? `${beneficiaryTitleLabels[title]} ` : ''

  return `${titleLabel}${nameOrEmpty(firstName)} ${nameOrEmpty(
    lastname.toUpperCase(),
  )}`
}
