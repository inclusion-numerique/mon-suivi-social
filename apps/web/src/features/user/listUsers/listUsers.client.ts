import { canListUsers } from '@mss/web/security/rules'
import z from 'zod'
import { createQueryClient } from '@mss/web/features/createQuery.client'

export const ListUsersClient = createQueryClient({
  name: 'user.list',
  securityCheck: canListUsers,
  inputValidation: z.object({
    structureId: z.string().uuid(),
    search: z.string().trim().optional(),
    page: z.number().int().gt(0).default(1),
    perPage: z.number().int().gt(0).default(25),
    orderBy: z.array(z.object({})).optional(),
  }),
})
