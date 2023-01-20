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
          tab?: 'info' | 'fichiers' | 'historique'
          // ID of item to scroll to in history tab
          accompagnement?: string
        },
      ) => withSearchParams(`/structure/beneficiaires/${fileNumber}`)(params),
      Nouveau: `/structure/beneficiaires/nouveau`,
      Modifier: ({ fileNumber }: { fileNumber: string }) =>
        `/structure/beneficiaires/${fileNumber}/modifier`,
    },
    Accompagnements: {
      Index: '/structure/accompagnements',
      Entretien: {
        Nouveau: withSearchParams<{
          dossier: string
        }>('/structure/accompagnements/entretiens/nouveau'),
      },
      DemandeDAide: {
        Nouvelle: withSearchParams<{
          dossier: string
        }>('/structure/accompagnements/demande-d-aide/nouvelle'),
      },
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
