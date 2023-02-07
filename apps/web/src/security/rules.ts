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
export const isAdministrator = (grantee: SecurityRuleGrantee) =>
  grantee.role === 'Administrator' && grantee.status === 'Active'

export const isStructureManager = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
) =>
  grantee.role === 'StructureManager' &&
  grantee.structureId === target.structureId &&
  grantee.status === 'Active'

export const isInSameStructureAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  allowedRoles: AllowedRoles,
) =>
  !!grantee.structureId &&
  grantee.structureId === target.structureId &&
  grantee.status === 'Active' &&
  allowedRoles.includes(grantee.role)

export const isReferentFor = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithReferents,
) =>
  grantee.status === 'Active' &&
  grantee.role === 'Referent' &&
  !!target.referents.find(({ id }) => id === grantee.id)

export const isCreator = (
  grantee: SecurityRuleGrantee,
  target: { createdById?: string | null },
  allowedRoles: AllowedRoles,
) =>
  grantee.id === target.createdById &&
  grantee.status === 'Active' &&
  allowedRoles.includes(grantee.role)

export type SecurityRule<
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
> = (
  grantee: Grantee,
  target: Target,
  securityParams: SecurityParams,
) => boolean

// A rule is a syncronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)

export const canCreateUser = (
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
  params: { role: UserRole },
): boolean =>
  isAdministrator(grantee) ||
  (isStructureManager(grantee, target) && params.role !== 'Administrator')

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

export const canCreateBeneficiaryWithGeneralInfo = (
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

export const canCreateBeneficiaryWithFullData = (
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

export const canViewBeneficiaryHelpRequest = (
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

export const canAccessSocialRightsSimulator = (
  grantee: SecurityRuleGrantee,
): boolean => true

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

export const canAccessStatsPage = (
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

export const canExportStats = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, ['StructureManager', 'SocialWorker'])
