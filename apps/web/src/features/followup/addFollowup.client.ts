import { canCreateBeneficiaryFollowup } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { FollowupMedium, FollowupStatus } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'
import { createFollowupSchema } from '@mss/web/server/schema'

export const AddFollowupClient = createMutationClient({
  name: 'followup.add',
  title: "Ajout d'entretien",
  securityCheck: canCreateBeneficiaryFollowup,
  inputValidation: createFollowupSchema,
  beneficiaryAnonymization: () => ({
    thirdPersonName: undefined,
    place: undefined,
    synthesis: undefined,
    privateSynthesis: undefined,
  }),
  fieldLabels: {
    beneficiaryId: 'Bénéficiaire',
    types: 'Accompagnement(s)',
    medium: "Type d'entretien",
    documents: 'Document(s)',
    status: 'Statut',
    date: 'Date',
    dueDate: "Date d'échéance",
    place: 'Lieu',
    thirdPersonName: 'Tierce personne',
    structureName: 'Organisme prescripteur',
    synthesis: 'Compte rendu',
    privateSynthesis: 'Compte rendu privé',
    redirected: "Réorienté après l'entretien",
    helpRequested: "Instruction de demande d'aide",
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddFollowupClient = typeof AddFollowupClient
