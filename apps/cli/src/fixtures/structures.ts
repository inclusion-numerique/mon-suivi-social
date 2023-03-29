import { prismaClient } from '@mss/web/src/server/prisma'

export const fixtureStructure = {
  id: '3cb0f254-1e5a-4b60-82e8-dd58cf7bf710',
  name: 'Structure de Démonstration',
  email: 'monsuivisocial@anct.gouv.fr',
  type: 'Ccas',
  address: '12 rue de la République',
  city: 'Lyon',
  zipcode: '69002',
  phone: '01 01 01 01 01',
} satisfies Exclude<
  Parameters<typeof prismaClient.structure.createMany>[0],
  undefined
>['data']
