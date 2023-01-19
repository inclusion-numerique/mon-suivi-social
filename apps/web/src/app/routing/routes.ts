// XXX What is the best practice to store routing logic and typings ?
// Ideal would be to validate path depending on directory structure

import { withSearchParams } from '@mss/web/app/routing/withSearchParams'

export const Routes = {
  Connexion: {
    Login: '/connexion/login',
    Logout: '/connexion/logout',
    Erreur: '/connexion/erreur',
    Verification: '/connexion/verification',
  },
  Structure: {
    Index: '/structure',
    MonCompte: {
      Index: '/structure/mon-compte',
    },
    Beneficiaires: {
      Index: '/structure/beneficiaires',
    },
    Beneficiaire: {
      Index: ({ fileNumber }: { fileNumber: string }) =>
        `/structure/beneficiaires/${fileNumber}`,
      IndexWithParams: (
        { fileNumber }: { fileNumber: string },
        params: {
          tab?: 'entretiens' | 'demandes'
          // ID of item to scroll to
          item?: string
        },
      ) => withSearchParams(`/structure/beneficiaires/${fileNumber}`)(params),
    },
    Accompagnements: {
      Index: '/structure/accompagnements',
    },
    TableauDeBord: {
      Index: '/structure/tableau-de-bord',
    },
    Statistiques: {
      Index: '/structure/statistiques',
    },
    Structures: {
      Index: '/structure/structures',
      Modifier: ({ organisationId }: { organisationId: string }) =>
        `/structure/structures/${organisationId}/modifier`,
    },
    Utilisateurs: {
      Index: '/structure/utilisateurs',
    },
  },
}
