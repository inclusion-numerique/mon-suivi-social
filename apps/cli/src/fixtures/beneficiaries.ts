import { prismaClient } from '@mss/web/src/prismaClient'
import { fixtureStructure } from './structures'

export const fixtureBeneficiaries = [
  {
    id: 'db5190cf-3942-4eea-90f3-8a2992146360',
    firstName: 'Alice',
    birthName: 'Allard',
    email: 'alice.allard@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0001',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '19131e3c-ece5-4aba-a322-f795c1342287',
    firstName: 'Benoit',
    birthName: 'Blanchet',
    email: 'benoit.blanchet@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0002',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '4d7b7c30-0630-4a3e-b52a-c4b176ad7e85',
    firstName: 'Carole',
    birthName: 'Cartier',
    email: 'carole.cartier@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0003',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '0042d145-d573-423c-be40-29a3090b44ff',
    firstName: 'Denis',
    birthName: 'Dubois',
    email: 'denis.dubois@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0004',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '7d99a4ca-87b3-4059-a89a-d14aade63b93',
    firstName: 'Emma',
    birthName: 'Endel',
    email: 'emma.endel@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0005',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '9bb0033f-7eb4-4aa6-952a-970886459390',
    firstName: 'François',
    birthName: 'Le Français',
    email: 'francois.lefrancais@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0006',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: 'c85390a9-3d93-471a-a125-824aa8aa806c',
    firstName: 'Gaspard',
    birthName: 'Garnier',
    email: 'gaspard.garnier@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0007',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '3d9e716b-95ad-4cea-aafb-63c4e1839585',
    firstName: 'Hugo',
    birthName: 'Hictor',
    email: 'hugo.hictor@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0008',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: '7e2e152b-babf-487a-b392-fccc36da57b0',
    firstName: 'Inès',
    birthName: 'Ille',
    email: 'ines.ille@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0009',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
  {
    id: 'e6736c43-0991-4642-9400-b4144dfceb18',
    firstName: 'Jasmine',
    birthName: 'Jalla',
    email: 'jasmine.jalla@v2.monsuivisocial.incubateur.anct.gouv.fr',
    fileNumber: 'DEMO0010',
    status: 'Active',
    structureId: fixtureStructure.id,
  },
] satisfies Exclude<
  Parameters<typeof prismaClient.beneficiary.createMany>[0],
  undefined
>['data']