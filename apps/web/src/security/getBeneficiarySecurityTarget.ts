import { prismaClient } from '@mss/web/prismaClient'

export const beneficiarySecurityTargetSelect = {
  id: true,
  structureId: true,
  referents: { select: { id: true } },
} as const

export const beneficiarySecurityTargetInclude = {
  select: beneficiarySecurityTargetSelect,
} as const

export const getBeneficiarySecurityTarget = (id: string) =>
  prismaClient.beneficiary.findUnique({
    where: { id },
    select: beneficiarySecurityTargetSelect,
  })
export const getBeneficiarySecurityTargetByFileNumber = (fileNumber: string) =>
  prismaClient.beneficiary.findUnique({
    where: { fileNumber },
    select: beneficiarySecurityTargetSelect,
  })
