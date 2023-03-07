import { getBeneficiaireToView } from './getBeneficiaireToView'
import { getBeneficiaireToUpdate } from './getBeneficiaireToUpdate'
import { getDocuments } from './getDocuments'
import { getFollowupTypes } from './getFollowupTypes'
import { getSupports } from './getSupports'
import { getAgentOptions } from './getAgentOptions'
import { getBeneficiaire } from './getBeneficiaire'

export const BeneficiairesBusiness = {
  getBeneficiaireToUpdate,
  getDocuments,
  getFollowupTypes,
  getSupports,
  getBeneficiaireToView,
  getAgentOptions,
  getBeneficiaire,
}

export type { GetSupportsReturn } from './getSupports'
export type { GetBeneficiaireToViewReturn } from './getBeneficiaireToView'
