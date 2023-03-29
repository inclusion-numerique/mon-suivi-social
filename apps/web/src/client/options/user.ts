import { UserRole } from '@prisma/client'
import { labelsToOptions } from '../../utils/options'

export const NonAdminUserRoleLabels: { [key in NonAdminUserRole]: string } = {
  [UserRole.ReceptionAgent]: "Agent d'accueil/CNFS",
  [UserRole.Instructor]: 'Instructeur',
  [UserRole.SocialWorker]: 'Travailleur social',
  [UserRole.Referent]: 'Référent',
  [UserRole.StructureManager]: 'Responsable de structure',
}
export const UserRoleLabels: { [key in UserRole]: string } = {
  ...NonAdminUserRoleLabels,
  [UserRole.Administrator]: 'Administrateur',
}

export const nonAdminUserRoleOptions = labelsToOptions(NonAdminUserRoleLabels)

const { Administrator, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NonAdminUserRole = keyof typeof NonAdminUserRole
