import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation'

export const EditStructureClient = createMutationClient({
  name: 'structure.edit',
  inputValidation: z.object({
    structureId: z.string().uuid(),
    name: z.string().min(2),
    zipcode: z.string().min(5),
    city: z.string().min(2),
    address: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    // Ids of the followupTypes to propose
    proposedFollowupTypes: z.array(z.string().uuid()),
  }),
  // TODO Do a type for security rule function, with first grantee, second T, third V
  // TODO The second and third parameter of security rule is in params of mutation Client
  // TODO When calling execute, the developer must give the security params and the input
  securityCheck: canEditStructure,
  humanizeInput: {
    structureId: 'Identifiant de la structure',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    city: 'Ville',
    proposedFollowupTypes: 'Accompagnements proposés',
    address: 'Adresse',
    zipcode: 'Code postal',
  },
})

export type EditStructureClient = typeof EditStructureClient
