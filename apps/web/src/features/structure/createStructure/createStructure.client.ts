import { isAdministrator } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { StructureType } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'
import { createStructureSchema } from '@mss/web/server/schema'

export const CreateStructureClient = createMutationClient({
  name: 'structure.create',
  title: 'Création de structure',
  securityCheck: (grantee) => isAdministrator(grantee),
  inputValidation: createStructureSchema,
  fieldLabels: {
    type: 'Type',
    name: 'Raison sociale',
    address: 'Adresse',
    zipcode: 'Code postal',
    email: 'Email',
    phone: 'Téléphone',
    city: 'Ville',
    proposedFollowupTypes: 'Accompagnements proposés',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateStructureClient = typeof CreateStructureClient
