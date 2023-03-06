import { findByFileNumber } from './findByFileNumber'
import { loadByFileNumber } from './loadByFileNumber'
import { findByFileNumberAndStructure } from './findByFileNumberAndStructure'
import { findById } from './findById'
import { getBeneficiarySupportsByAgent } from './getBeneficiarySupportsByAgent'

const BeneficiaryQuery = {
  findByFileNumber,
  loadByFileNumber,
  findByFileNumberAndStructure,
  findById,
  getBeneficiarySupportsByAgent,
}

export { BeneficiaryQuery }
