import { prismaClient } from '@mss/web/src/prismaClient'
import { fixtureStructure } from './structures'

export const fixturesFollowupTypes = [
  {
    id: 'a5ddd670-448c-4242-b919-962bcaf047aa',
    name: 'Domiciliation',
    legallyRequired: true,
  },
  {
    id: '825a4869-3676-4ef7-9913-90585a9d09ea',
    name: "Demande d'aides ménagères",
    legallyRequired: true,
  },
  {
    id: 'a6f2c851-32ea-4ddb-acf2-b1ba4c665134',
    name: 'Obligation alimentaire',
    legallyRequired: true,
  },
  {
    id: '7e72edda-8cea-45c6-ac7a-8711edefee9f',
    name: "Aide médicale d'État",
    legallyRequired: true,
  },
  {
    id: '19fd9b2d-352d-4f14-aa03-8a67135f0ced',
    name: 'Complémentaire santé solidaire',
    legallyRequired: true,
  },
  {
    id: 'b268c216-7121-4ddd-9a97-5f66b0181039',
    name: 'Allocation de solidarité aux personnes âgées',
    legallyRequired: true,
  },
  {
    id: 'b6db1016-bcba-4bbe-b8e6-39d593b20e5b',
    name: "Allocation personnalisées d'autonomie",
    legallyRequired: true,
  },
  {
    id: '023fe9a9-0bac-4c82-9bf3-80e4f852c9fa',
    name: 'Revenu de solidarité active',
    legallyRequired: true,
  },
  {
    id: '6b7446d4-03f0-4ed6-82b3-518d7ee1ab7e',
    name: 'Aide sociale',
    legallyRequired: true,
  },
  {
    id: '4d384e97-eee3-4968-b762-c0651f0086c6',
    name: "Entrée en famille d'accueil",
    legallyRequired: true,
  },
  {
    id: '32caa62b-c482-446f-974f-1e9ed1982f95',
    name: 'Entrée en hébergement pour personnes âgées',
    legallyRequired: true,
  },
  {
    id: 'b772ae55-d09b-4e9b-9ca1-6bab6ded7ca7',
    name: 'Entrée en établissement pour personnes handicapées',
    legallyRequired: true,
  },
  {
    id: 'f245fc8b-b2dd-4abe-bf92-9e6e8ad99795',
    name: 'PUMA',
    legallyRequired: true,
  },
  {
    id: '0b75d831-75c6-41b5-9c44-b46f5e2f2bb8',
    name: 'Accompagnement social',
    legallyRequired: false,
  },
  {
    id: '20074b98-be34-4ba7-9bb2-2d78eb9e5ca9',
    name: 'Aides financières non remboursables',
    legallyRequired: false,
  },
  {
    id: '5479376a-5ee7-4da7-9bda-de20021a1ee1',
    name: 'Aides financières remboursables',
    legallyRequired: false,
  },
  {
    id: 'a6164b53-1f69-4195-98e1-254c1169cf21',
    name: 'Animations seniors',
    legallyRequired: false,
  },
  {
    id: '768c7ec8-af6d-4482-9b8b-e3fa32412218',
    name: 'Animations familles',
    legallyRequired: false,
  },
  {
    id: '2a99a68e-5312-4f2c-a4ff-c97a80d93336',
    name: 'Inclusion numérique',
    legallyRequired: false,
  },
  {
    id: '592bd4f9-793f-4dea-8634-b702dd36d7ec',
    name: 'Plan alerte et urgence',
    legallyRequired: false,
  },
  {
    id: '610cfc5d-d483-49ea-8ab0-b54e43c42960',
    name: 'Aide au transport',
    legallyRequired: false,
  },
  {
    id: '963cd9c8-824a-4c18-8084-01fb91e0c560',
    name: 'Soutien administratif',
    legallyRequired: false,
  },
  {
    id: 'de903c55-48e2-40b6-b1c5-e44f73aa7b6b',
    name: 'Aide alimentaire',
    legallyRequired: false,
  },
  {
    id: 'd895b9f6-f77b-4a71-b91c-d24849099d19',
    name: "Secours d'urgence",
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id,
  },
  {
    id: 'cef7fd27-c52a-40ef-a4f2-a7b8411ea45b',
    name: 'PASS Adulte',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id,
  },
  {
    id: '6b013f11-5c7b-41e0-9da9-a56e827c1952',
    name: 'Aide à la culture',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id,
  },
  {
    id: 'd669e072-ea3b-4633-8db9-13d7c87290ab',
    name: 'Aide au relogement',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id,
  },
] satisfies Exclude<
  Parameters<typeof prismaClient.followupType.createMany>[0],
  undefined
>['data']
