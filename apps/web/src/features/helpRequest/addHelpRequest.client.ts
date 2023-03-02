import { canCreateBeneficiaryHelpRequest } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  HelpRequestReason,
  HelpRequestStatus,
  PaymentMethod,
} from '@prisma/client'
import { labelsToOptions, Options } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'

export const AddHelpRequestClient = createMutationClient({
  name: 'helpRequest.add',
  title: "Ajout de demande d'aide",
  securityCheck: canCreateBeneficiaryHelpRequest,
  inputValidation: z.object({
    beneficiaryId: z.string().uuid(),
    openingDate: z.date(errorMessages),
    type: z.string(errorMessages).uuid(),
    documents: z.array(z.string(), errorMessages).default([]),
    financialSupport: z.enum(['true', 'false']).nullish(),
    externalStructure: z.enum(['true', 'false']).nullish(),
    status: z.nativeEnum(HelpRequestStatus, errorMessages),
    askedAmount: z.number().min(0).nullish(),
    examinationDate: z.date(errorMessages).nullish(),
    decisionDate: z.date(errorMessages).nullish(),
    allocatedAmount: z.number().min(0).nullish(),
    paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
    reason: z.nativeEnum(HelpRequestReason).nullish(),
    paymentDate: z.date(errorMessages).nullish(),
    handlingDate: z.date(errorMessages).nullish(),
    refusalReason: z.string().nullish(),
    prescribingOrganisation: z.string().nullish(),
    examiningOrganisation: z.string().nullish(),
    dispatchDate: z.date(errorMessages).nullish(),
    synthesis: z.string().nullish(),
    privateSynthesis: z.string().nullish(),
    dueDate: z.date(errorMessages).nullish(),
    fullFile: z.boolean().default(false),
  }),
  beneficiaryAnonymization: () => ({
    refusalReason: '',
    synthesis: '',
    privateSynthesis: '',
  }),
  fieldLabels: {
    beneficiaryId: 'Bénéficiaire',
    type: 'Accompagnement',
    openingDate: "Date d'ouverture du dossier",
    prescribingOrganisation: 'Organisme prescripteur',
    status: 'Statut',
    fullFile: 'Dossier complet',
    financialSupport: "S'agit-il d'une aide financière ?",
    reason: "Motif de l'aide financière",
    externalStructure: "L'instruction de la demande est réalisée...",
    dueDate: "Date d'échéance",
    documents: 'Documents',
    examiningOrganisation: 'Organisme instructeur',
    askedAmount: 'Montant demandé',
    examinationDate: 'Date de passage en commission',
    refusalReason: 'Motif du refus',
    decisionDate: 'Date de la décision',
    allocatedAmount: 'Montant attribué',
    paymentMethod: 'Mode de paiement',
    paymentDate: 'Date du paiement',
    handlingDate: 'Date de fin de prise en charge',
    dispatchDate: "Date d'envoi du dossier",
    synthesis: 'Compte rendu',
    privateSynthesis: 'Compte rendu privé',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddHelpRequestClient = typeof AddHelpRequestClient

export const helpRequestStatusLabels: { [key in HelpRequestStatus]: string } = {
  [HelpRequestStatus.WaitingAdditionalInformation]:
    'En attente de justificatifs',
  [HelpRequestStatus.InvestigationOngoing]: "En cours d'instruction",
  [HelpRequestStatus.Accepted]: 'Accepté',
  [HelpRequestStatus.Refused]: 'Refusé',
  [HelpRequestStatus.Adjourned]: 'Ajourné',
  [HelpRequestStatus.ClosedByBeneficiary]: 'Clôturé par le bénéficiaire',
  [HelpRequestStatus.Dismissed]: 'Classé sans suite',
}

export const helpRequestStatusBadgeClasses: {
  [key in HelpRequestStatus]: string
} = {
  [HelpRequestStatus.Accepted]: 'fr-badge--success',
  [HelpRequestStatus.InvestigationOngoing]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-time-line',
  [HelpRequestStatus.Refused]: 'fr-badge--error',
  [HelpRequestStatus.WaitingAdditionalInformation]:
    'fr-badge--info fr-badge--icon-left fr-icon-time-line',
  [HelpRequestStatus.ClosedByBeneficiary]: 'fr-badge--error ',
  [HelpRequestStatus.Dismissed]: 'fr-badge--error',
  [HelpRequestStatus.Adjourned]:
    'fr-badge--orange-terre-battue fr-badge--icon-left fr-icon-error-line',
}

export const helpRequestStatusOptions = labelsToOptions(helpRequestStatusLabels)

export const financialSupportOptions: Options = [
  { value: 'true', name: 'Oui' },
  { value: 'false', name: 'Non' },
]

export const externalOrganisationOptions: Options = [
  { value: 'false', name: 'En interne' },
  { value: 'true', name: 'Par une organisation extérieure' },
]

export const paymentMethodLabels: { [key in PaymentMethod]: string } = {
  [PaymentMethod.FoodStamps]: 'Bons alimentaires',
  [PaymentMethod.CreditCard]: 'Carte bancaire',
  [PaymentMethod.Check]: 'Chèque',
  [PaymentMethod.Cash]: 'Espèces',
  [PaymentMethod.WireTransfer]: 'Virement',
}

export const paymentMethodOptions = labelsToOptions(paymentMethodLabels)

export const helpRequestReasonLabels: { [key in HelpRequestReason]: string } = {
  [HelpRequestReason.Food]: 'Alimentation',
  [HelpRequestReason.Energy]: 'Énergie',
  [HelpRequestReason.Housing]: 'Logement',
  [HelpRequestReason.Other]: 'Autre',
}

export const helpRequestReasonOptions = labelsToOptions(helpRequestReasonLabels)
