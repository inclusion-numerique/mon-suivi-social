import { User, UserRole } from '@prisma/client'

export type SecurityRuleGrantee = Pick<
  User,
  'id' | 'role' | 'structureId' | 'status'
>

export type SecurityTargetWithReferents = {
  referents: { id: string }[]
}

export type SecurityTargetWithStructure = {
  structureId: string | null
}

export type SecurityTargetWithCreator = {
  createdById: string | null
}

// Helper type to safely type an array with at least one UserRole
type AllowedRoles =
  | [UserRole]
  | [UserRole, UserRole]
  | [UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole, UserRole, UserRole]

// Grantee role utilities
export const isActiveWithAllowedRole = (
  grantee: SecurityRuleGrantee,
  allowedRoles: AllowedRoles,
) => grantee.status === 'Active' && allowedRoles.includes(grantee.role)

export const isAdministrator = (grantee: SecurityRuleGrantee) =>
  isActiveWithAllowedRole(grantee, ['Administrator'])

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
) =>
  isActiveWithAllowedRole(grantee, ['StructureManager']) &&
  grantee.structureId === target.structureId

export const isInSameStructureAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  allowedRoles: AllowedRoles,
) =>
  !!grantee.structureId &&
  grantee.structureId === target.structureId &&
  isActiveWithAllowedRole(grantee, allowedRoles)

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents,
) =>
  isActiveWithAllowedRole(grantee, ['Referent']) &&
  target.referents.some(({ id }) => id === grantee.id)

export const isCreator = (
  grantee: SecurityRuleGrantee,
  target: { createdById?: string | null },
  allowedRoles: AllowedRoles,
) =>
  grantee.id === target.createdById &&
  isActiveWithAllowedRole(grantee, allowedRoles)

export type SecurityRule<
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = unknown,
  SecurityParameters = unknown,
> = (
  grantee: Grantee,
  target: Target,
  securityParameters: SecurityParameters,
) => boolean

// A rule is a synchronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)

export const canCreateUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canEditUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canDeleteUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canListUsers = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canChangeUserRole = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  parameters: { role: UserRole },
): boolean =>
  isAdministrator(grantee) ||
  (isStructureManager(grantee, target) && parameters.role !== 'Administrator')

export const canListStructures = (grantee: SecurityRuleGrantee): boolean =>
  isAdministrator(grantee)

export const canViewStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canEditStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canListBeneficiaries = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canViewBeneficiaryGeneralInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFullInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canEditBeneficiaryGeneralInfo = canViewBeneficiaryGeneralInfo
export const canEditBeneficiaryFullInfo = canViewBeneficiaryFullInfo

export const canDeleteBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ])

export const canUpdateBeneficiaryReferents = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canExportBeneficiariesData = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager'])

export const canAddBeneficiaryDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canEditBeneficiaryDocument = canAddBeneficiaryDocument

export const canViewBeneficiaryDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canCreateBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canListBeneficiaryFollowups = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isCreator(grantee, followup, ['ReceptionAgent']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowupSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ]) ||
  isCreator(grantee, followup, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowupPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isCreator(grantee, followup, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canEditBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, followup, [
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canAddCommentToBeneficiaryFollowup = canListBeneficiaryFollowups
export const canListCommentsToBeneficiaryFollowup = canViewBeneficiaryFollowup

export const canDeleteBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, followup, ['SocialWorker', 'Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canCreateBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canListBeneficiaryHelpRequests = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canAccessProtectedDataInHelpRequest = (
  grantee: SecurityRuleGrantee,
): boolean =>
  isActiveWithAllowedRole(grantee, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
  ])

export const canViewBeneficiaryHelpRequestSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ]) ||
  isCreator(grantee, helpRequest, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHelpRequestPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isCreator(grantee, helpRequest, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ])

export const canEditBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, helpRequest, ['SocialWorker', 'Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canAddCommentToBeneficiaryHelpRequest =
  canListBeneficiaryHelpRequests
export const canListCommentsToBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ]) ||
  isCreator(grantee, helpRequest, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canAccessSocialRightsSimulator = (): boolean => true

export const canAccessFollowupsPage = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canExportFollowupsData = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
  ])

export const canAccessStatsPage = (grantee: SecurityRuleGrantee): boolean =>
  isAdministrator(grantee) ||
  isActiveWithAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
  ])

export const canExportStats = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, ['StructureManager', 'SocialWorker'])
