import { canCreateBeneficiaryHelpRequest } from '@mss/web/security/rules'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { createHelpRequestSchema } from '@mss/web/server/schema'

export const AddHelpRequestClient = createMutationClient({
  name: 'helpRequest.add',
  title: "Ajout de demande d'aide",
  securityCheck: canCreateBeneficiaryHelpRequest,
  inputValidation: createHelpRequestSchema,
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
