import { User, UserRole } from '@prisma/client'

export type SecurityRuleGrantee = Pick<
  User,
  'id' | 'role' | 'organisationId' | 'status'
>

export type SecurityTargetWithReferents = {
  referents: { id: string }[]
}

export type SecurityTargetWithOrganisation = {
  organisationId: string | null
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
  target: SecurityTargetWithOrganisation,
) =>
  grantee.role === 'StructureManager' &&
  grantee.organisationId === target.organisationId &&
  grantee.status === 'Active'

export const isInSameOrganisationAs = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
  allowedRoles: AllowedRoles,
) =>
  !!grantee.organisationId &&
  grantee.organisationId === target.organisationId &&
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

// A rule is a syncronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)

export const canCreateUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canDeleteUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canListUsers = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canChangeUserRole = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
  params: { role: UserRole },
): boolean =>
  isAdministrator(grantee) ||
  (isStructureManager(grantee, target) && params.role !== 'Administrator')

export const canEditOrganisation = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canListBeneficiaries = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canCreateBeneficiaryWithGeneralInfo = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canCreateBeneficiaryWithFullInfo = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
  ])

export const canViewBeneficiaryGeneralInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFullInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canEditBeneficiaryGeneralInfo = canViewBeneficiaryGeneralInfo
export const canEditBeneficiaryFullInfo = canViewBeneficiaryFullInfo

export const canDeleteBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ])

export const canUpdateBeneficiaryReferents = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canExportBeneficiariesData = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, ['StructureManager'])

export const canAddBeneficiaryDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canCreateBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canListBeneficiaryFollowups = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isCreator(grantee, followup, ['ReceptionAgent']) ||
  isReferentFor(grantee, beneficiary)

export const canEditBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, ['StructureManager']) ||
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
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, followup, ['SocialWorker', 'Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canCreateBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canListBeneficiaryHelpRequests = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
  ]) ||
  isCreator(grantee, helpRequest, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canEditBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, helpRequest, ['SocialWorker', 'Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canAddCommentToBeneficiaryHelpRequest =
  canListBeneficiaryHelpRequests
export const canListCommentsToBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithOrganisation & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, beneficiary, [
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
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const canExportFollowupsData = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
  ])

export const canAccessStatsPage = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
  ])

export const canExportStats = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithOrganisation,
): boolean =>
  isAdministrator(grantee) ||
  isInSameOrganisationAs(grantee, target, ['StructureManager', 'SocialWorker'])
