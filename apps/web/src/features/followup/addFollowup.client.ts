import { canCreateBeneficiaryFollowup } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { FollowupMedium, FollowupStatus } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'

export const AddFollowupClient = createMutationClient({
  name: 'followup.add',
  securityCheck: canCreateBeneficiaryFollowup,
  inputValidation: z.object({
    structureId: z.string().uuid(),
    beneficiaryId: z.string().uuid(),
    types: z
      .array(z.string().uuid())
      .min(1, "Veuillez renseigner au moins un type d'accompagnement"),
    documents: z.array(z.string().uuid()).default([]),
    medium: z.nativeEnum(FollowupMedium),
    date: z.string(),
    syntesis: z.string().optional(),
    privateSynthesis: z.string().optional(),
    status: z.nativeEnum(FollowupStatus),
    helpRequested: z.boolean().default(false),
    place: z.string().optional(),
    redirected: z.boolean().default(false),
    structureName: z.string().optional(),
    dueDate: z.string().optional(),
    thirdPersonName: z.string().optional(),
  }),
  // TODO anonymize all identification fields from above
  beneficiaryAnonymization: ({ ...data }) => ({
    thirdPersonName: '',
    syntesis: '',
    privateSynthesis: '',
  }),
  fieldLabels: {
    structureId: 'Structure',
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
    syntesis: 'Compte rendu',
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

export const followupStatusOptions = labelsToOptions(followupStatusLabels)
