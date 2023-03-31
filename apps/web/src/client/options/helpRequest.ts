import {
  HelpRequestReason,
  HelpRequestStatus,
  PaymentMethod,
} from '@prisma/client'
import { labelsToOptions, Options } from '../../utils/options'

export const helpRequestStatusLabels: { [key in HelpRequestStatus]: string } = {
  [HelpRequestStatus.WaitingAdditionalInformation]:
    'En attente de justificatifs',
  [HelpRequestStatus.InvestigationOngoing]: 'En cours',
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
