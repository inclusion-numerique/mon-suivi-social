// XXX What is the best practice to store routing logic and typings ?
// Ideal would be to validate path depending on directory structure

import { withSearchParams } from '@mss/web/app/routing/withSearchParams'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { Beneficiary } from '@prisma/client'

export const Routes = {
  Connexion: {
    Login: '/connexion/login',
    Logout: '/connexion/logout',
    Erreur: '/connexion/erreur',
    Verification: '/connexion/verification',
  },
  Structure: {
    Index: {
      title: 'Tableau de bord',
      path: '/tableau-de-bord',
      icon: 'profil-line',
    },
    MonCompte: {
      Index: {
        title: 'Mon compte',
        icon: 'user-setting-line',
        path: '/mon-compte',
      },
    },
    Beneficiaires: {
      Index: {
        title: 'Bénéficiaires',
        icon: 'user-line',
        path: '/beneficiaires',
      },
      Beneficiaire: {
        Index: {
          title: beneficiaryDisplayName,
          icon: 'user-line',
          path: (
            { fileNumber }: { fileNumber: string },
            params?: {
              tab?: 'info' | 'documents' | 'historique'
              // ID of item to scroll to in history tab
              accompagnement?: string
            },
          ) => withSearchParams(`/beneficiaires/${fileNumber}`)(params),
        },

        Modifier: {
          title: (
            beneficiary: Pick<
              Beneficiary,
              'firstName' | 'usualName' | 'birthName' | 'fileNumber'
            >,
          ) => `${beneficiaryDisplayName(beneficiary)} · Modification`,
          icon: 'user-line',
          breadcrumbsTitle: 'Modification',
          path: ({ fileNumber }: { fileNumber: string }) =>
            `/beneficiaires/${fileNumber}/modifier`,
        },
      },
      Nouveau: {
        title: 'Ajouter un·e bénéficiaire',
        icon: 'user-line',
        path: `/beneficiaires/nouveau`,
      },
    },
    Accompagnements: {
      Index: {
        title: 'Accompagnements',
        icon: 'folder-2-line',
        path: '/accompagnements',
      },
      Entretien: {
        Nouveau: {
          title: 'Nouvel entretien',
          icon: 'folder-2-line',
          path: withSearchParams<{
            dossier: string
          }>('/accompagnements/entretiens/nouveau'),
        },
      },
      DemandeDAide: {
        Nouvelle: {
          title: "Nouvelle demande d'aide",
          icon: 'folder-2-line',
          path: withSearchParams<{
            dossier: string
          }>('/accompagnements/demande-d-aide/nouvelle'),
        },
      },
    },
    Statistiques: {
      Index: {
        title: 'Statistiques',
        icon: 'pie-chart-2-line',
        path: '/statistiques',
      },
    },
    Structures: {
      Index: {
        title: 'Structures',
        icon: 'building-line',
        path: '/structures',
      },
    },
    Structure: {
      Index: {
        title: ({ name }: { name: string }) => name,
        icon: 'building-line',
        path: ({ id }: { id: string }) => `/structure/${id}`,
      },
      Modifier: {
        title: ({ name }: { name: string }) => `${name} · Modification`,
        breadcrumbsTitle: 'Modification',
        icon: 'building-line',
        path: ({ structureId }: { structureId: string }) =>
          `/structure/${structureId}/modifier`,
      },
    },
    Utilisateurs: {
      Index: {
        title: 'Utilisateurs',
        icon: 'team-line',
        path: '/utilisateurs',
      },
    },
  },
}

// Helper type for typing props of pages components
export type RoutePathParams<T extends (...args: any) => any> = Parameters<T>[0]

export type RoutePathSearchParams<T extends (...args: any) => any> =
  Parameters<T>[1]
