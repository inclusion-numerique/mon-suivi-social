import { canCreateUser } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { labelsToOptions } from '@mss/web/utils/options'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
} from '@mss/web/utils/zod'
import { UserRole } from '@prisma/client'

const { Administrator, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NonAdminUserRole = keyof typeof NonAdminUserRole

export const CreateUserClient = createMutationClient({
  name: 'user.create',
  title: "Création d'utilisateur",
  securityCheck: canCreateUser,
  inputValidation: z.object({
    structureId: z.string(errorMessages).uuid(),
    firstName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
    lastName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
    email: z.string(errorMessages).email(validEmailMessage),
    role: z.nativeEnum(NonAdminUserRole, {
      ...errorMessages,
      required_error: 'Veuillez renseigner le rôle',
    }),
  }),
  fieldLabels: {
    structureId: 'Structure',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    role: 'Rôle',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
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
