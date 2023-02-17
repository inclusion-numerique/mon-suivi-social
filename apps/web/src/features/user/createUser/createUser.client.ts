import { canCreateUser } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { labelsToOptions } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'
import { UserRole } from '@prisma/client'

const { Administrator, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles
export type NonAdminUserRole = keyof typeof NonAdminUserRole

export const CreateUserClient = createMutationClient({
  name: 'user.create',
  title: "Création d'utilisateur",
  securityCheck: canCreateUser,
  inputValidation: z.object({
    structureId: z.string(errorMessages).uuid(),
    firstName: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
    lastName: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
    email: z.string(errorMessages).email(errorMessages.invalid_type_error),
    role: z.nativeEnum(NonAdminUserRole, errorMessages),
  }),
  fieldLabels: {
    structureId: 'Structure',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    role: 'Rôle',
  },
})

export type CreateUserClient = typeof CreateUserClient

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
