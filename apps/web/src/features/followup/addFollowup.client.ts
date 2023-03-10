import { canCreateBeneficiaryFollowup } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { FollowupMedium, FollowupStatus } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'

export const AddFollowupClient = createMutationClient({
  name: 'followup.add',
  title: "Ajout d'entretien",
  securityCheck: canCreateBeneficiaryFollowup,
  inputValidation: z.object({
    beneficiaryId: z.string().uuid(),
    types: z
      .array(z.string().uuid(), {
        ...errorMessages,
        required_error: "Veuillez renseigner au moins un type d'accompagnement",
      })
      .min(1, "Veuillez renseigner au moins un type d'accompagnement"),
    documents: z.array(z.string(), errorMessages).default([]),
    medium: z.nativeEnum(FollowupMedium, errorMessages),
    date: z.date(errorMessages),
    synthesis: z.string().nullish(),
    privateSynthesis: z.string().nullish(),
    status: z.nativeEnum(FollowupStatus, errorMessages),
    helpRequested: z.boolean().default(false),
    place: z.string().nullish(),
    redirected: z.boolean().default(false),
    structureName: z.string().nullish(),
    dueDate: z.date(errorMessages).nullish(),
    thirdPersonName: z.string().nullish(),
  }),
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
