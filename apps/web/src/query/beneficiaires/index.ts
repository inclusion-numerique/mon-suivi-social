import { getBeneficiaryToView } from './getBeneficiaryToView'
import { getBeneficiaryToUpdate } from './getBeneficiaryToUpdate'
import { getDocuments } from './getDocuments'
import { getFollowupTypes } from './getFollowupTypes'
import { getSupports } from './getSupports'
import { getAgentOptions } from './getAgentOptions'
import { getBeneficiary } from './getBeneficiary'
import { iterateBeneficiaries } from './iterateBeneficiaries'

export const BeneficiairesQuery = {
  getBeneficiaryToUpdate,
  getDocuments,
  getFollowupTypes,
  getSupports,
  getBeneficiaryToView,
  getAgentOptions,
  getBeneficiary,
  iterateBeneficiaries,
}

export type { GetSupportsReturn } from './getSupports'
export type { GetBeneficiaryToViewReturn } from './getBeneficiaryToView'
export type { IterateBeneficiariesReturn } from './iterateBeneficiaries'
