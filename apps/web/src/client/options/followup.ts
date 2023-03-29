import { FollowupMedium, FollowupStatus } from '@prisma/client'
import { labelsToOptions } from '../../utils/options'

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
