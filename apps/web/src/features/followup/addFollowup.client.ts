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
    documents: z.array(z.string().uuid(), errorMessages).default([]),
    medium: z.nativeEnum(FollowupMedium, errorMessages),
    // TODO datetime validation do not work for date, use other test
    date: z.string(errorMessages),
    synthesis: z.string().nullish(),
    privateSynthesis: z.string().nullish(),
    status: z.nativeEnum(FollowupStatus, errorMessages),
    helpRequested: z.boolean().default(false),
    place: z.string().nullish(),
    redirected: z.boolean().default(false),
    structureName: z.string().nullish(),
    dueDate: z.string().nullish(),
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

export type AddFollowupClient = typeof AddFollowupClient

export const followupMediumLabels: { [key in FollowupMedium]: string } = {
  [FollowupMedium.UnplannedInPerson]: 'Accueil physique spontané',
  [FollowupMedium.PlannedInPerson]: 'Accueil physique sur rendez-vous',
  [FollowupMedium.PostalMail]: 'Courrier',
  [FollowupMedium.ThirdParty]: 'Entretien avec un tiers',
  [FollowupMedium.PhoneCall]: 'Entretien téléphonique',
  [FollowupMedium.Email]: 'E-mail',
  [FollowupMedium.BeneficiaryHouseAppointment]: 'Rendez-vous à domicile',
  [FollowupMedium.ExternalAppointment]: 'Rendez-vous extérieur',
  [FollowupMedium.Videoconference]: 'Visioconférence',
}

export const followupMediumOptions = labelsToOptions(followupMediumLabels)

export const followupStatusLabels: { [key in FollowupStatus]: string } = {
  [FollowupStatus.Todo]: 'À traiter',
  [FollowupStatus.InProgress]: 'En cours',
  [FollowupStatus.Done]: 'Terminé',
}

export const followupStatusClasses: { [key in FollowupStatus]: string } = {
  [FollowupStatus.Todo]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [FollowupStatus.InProgress]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [FollowupStatus.Done]:
    'fr-badge--success fr-badge--icon-left fr-icon-check-line',
}

export const followupStatusOptions = labelsToOptions(followupStatusLabels)
