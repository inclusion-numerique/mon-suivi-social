import { getBeneficiary } from './getBeneficiary'
import { getStructureFollowupTypes } from './getStructureFollowupTypes'
import { getFollowup } from './getFollowup'
import { getHelpRequest } from './getHelpRequest'
import { iterateFollowups } from './iterateFollowups'
import { iterateHelpRequests } from './iterateHelpRequests'

export const AccompagnementsQuery = {
  getBeneficiary,
  getStructureFollowupTypes,
  getFollowup,
  getHelpRequest,
  iterateFollowups,
  iterateHelpRequests,
}

export {
  type FollowupsListResult,
  type FollowupsList,
  type FollowupsListItem,
} from './iterateFollowups'

export {
  type HelpRequestsListResult,
  type HelpRequestsList,
  type HelpRequestsListItem,
} from './iterateHelpRequests'
