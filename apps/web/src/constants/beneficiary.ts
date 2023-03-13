import {
  Beneficiary,
  BeneficiaryAccomodationMode,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiaryMobility,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  BeneficiaryStatus,
  BeneficiaryTitle,
  Gender,
  IncomeSource,
} from '@prisma/client'
import { arrayToOptions, labelsToOptions } from '@mss/web/utils/options'

export const beneficiaryStatusLabels: { [key in BeneficiaryStatus]: string } = {
  [BeneficiaryStatus.Active]: 'Actif',
  [BeneficiaryStatus.Inactive]: 'Inactif',
  [BeneficiaryStatus.Archived]: 'Archivé',
  [BeneficiaryStatus.Deceased]: 'Décédé·e',
}

export const beneficiaryStatusOptions = labelsToOptions(beneficiaryStatusLabels)

export const beneficiaryDisplayName = ({
  firstName,
  birthName,
  usualName,
  fileNumber,
}: Pick<
  Beneficiary,
  'firstName' | 'usualName' | 'birthName' | 'fileNumber'
>): string => {
  if (!firstName && !birthName && !usualName) {
    return `n°${fileNumber}`
  }

  if (usualName) {
    return `${firstName ?? ''} ${usualName ?? ''}`.trim()
  }
  return `${firstName ?? ''} ${birthName ?? ''}`.trim()
}

export const beneficiaryTitleLabels: { [key in BeneficiaryTitle]: string } = {
  [BeneficiaryTitle.Miss]: 'Mme.',
  [BeneficiaryTitle.Mister]: 'M.',
}

export const beneficiaryTitleOptions = labelsToOptions(beneficiaryTitleLabels)

export const beneficiaryGenderLabels: { [key in Gender]: string } = {
  [Gender.Female]: 'Femme',
  [Gender.Male]: 'Homme',
  [Gender.Other]: 'Autre',
}

export const beneficiaryGenderOptions = labelsToOptions(beneficiaryGenderLabels)

export const beneficiaryAccomodationModeLabels: {
  [key in BeneficiaryAccomodationMode]: string
} = {
  [BeneficiaryAccomodationMode.NursingHome]: 'EHPAD, résidence senior',
  [BeneficiaryAccomodationMode.EmergencyHousing]:
    'Hébergement de type CHRS, CHU, CPH, CADA...',
  [BeneficiaryAccomodationMode.Parents]: 'Hébergé·e au domicile parental',
  [BeneficiaryAccomodationMode.ThirdPerson]: 'Hébergé·e chez un tiers',
  [BeneficiaryAccomodationMode.PrivateRenting]: 'Locataire parc privé',
  [BeneficiaryAccomodationMode.SocialRenting]: 'Locataire parc social',
  [BeneficiaryAccomodationMode.Fortune]: 'Logement de fortune',
  [BeneficiaryAccomodationMode.Substandard]: 'Logement insalubre',
  [BeneficiaryAccomodationMode.Owner]: 'Propriétaire',
  [BeneficiaryAccomodationMode.None]: 'Sans hébergement',
  [BeneficiaryAccomodationMode.Other]: 'Autre type de logement (hôtel...)',
}

export const beneficiaryAccomodationModeOptions = labelsToOptions(
  beneficiaryAccomodationModeLabels,
)

export const beneficiaryFamilySituationLabels: {
  [key in BeneficiaryFamilySituation]: string
} = {
  [BeneficiaryFamilySituation.Single]: 'Célibataire',
  [BeneficiaryFamilySituation.Divorced]: 'Divorcé·e',
  [BeneficiaryFamilySituation.Cohabitation]: 'En concubinage',
  [BeneficiaryFamilySituation.CoupleWithChildren]: 'En couple avec enfant(s)',
  [BeneficiaryFamilySituation.Married]: 'Marié·e',
  [BeneficiaryFamilySituation.CivilUnion]: 'Pacsé·e',
  [BeneficiaryFamilySituation.SingleParentWithChildren]:
    'Parent isolé·e avec enfant(s)',
  [BeneficiaryFamilySituation.Separated]: 'Séparé·e',
  [BeneficiaryFamilySituation.Widow]: 'Veuf·ve',
  [BeneficiaryFamilySituation.Other]: 'Autre',
}

export const beneficiaryFamilySituationOptions = labelsToOptions(
  beneficiaryFamilySituationLabels,
)

export const beneficiaryMobilityLabels: {
  [key in BeneficiaryMobility]: string
} = {
  [BeneficiaryMobility.None]: 'Aucun moyen de transport à disposition',
  [BeneficiaryMobility.Code]: 'Code obtenu',
  [BeneficiaryMobility.PublicTransport]: 'Dépendant des transports en commun',
  [BeneficiaryMobility.PermitWithVehicle]:
    'Permis B avec véhicule (voiture, moto, scooter)',
  [BeneficiaryMobility.PermitWithoutVehicle]: 'Permis B sans véhicule',
  [BeneficiaryMobility.PermitPending]: 'Permis et/ou code en cours',
  [BeneficiaryMobility.InvalidPermit]: 'Permis non valide ou suspendu',
  [BeneficiaryMobility.VehicleWithoutPermit]: 'Véhicule sans permis',
  [BeneficiaryMobility.BikeOrEquivalent]: 'Vélo ou trottinette électrique',
  [BeneficiaryMobility.OtherPermit]: 'Autres permis (poids lourds, bus)',
}

export const beneficiaryMobilityOptions = labelsToOptions(
  beneficiaryMobilityLabels,
)

export const beneficiaryGirLabels: {
  [key in BeneficiaryGir]: string
} = {
  [BeneficiaryGir.Level1]: 'Niveau 1',
  [BeneficiaryGir.Level2]: 'Niveau 2',
  [BeneficiaryGir.Level3]: 'Niveau 3',
  [BeneficiaryGir.Level4]: 'Niveau 4',
  [BeneficiaryGir.Level5]: 'Niveau 5',
  [BeneficiaryGir.Level6]: 'Niveau 6',
}

export const beneficiaryGirOptions = labelsToOptions(beneficiaryGirLabels)

export const beneficiarySocioProfessionalCategoryLabels: {
  [key in BeneficiarySocioProfessionalCategory]: string
} = {
  [BeneficiarySocioProfessionalCategory.SickLeave]: 'Arrêt maladie',
  [BeneficiarySocioProfessionalCategory.JobSeeker]: "En recherche d'emploi",
  [BeneficiarySocioProfessionalCategory.Disability]: 'Invalidité',
  [BeneficiarySocioProfessionalCategory.Housewife]: 'Mère au foyer',
  [BeneficiarySocioProfessionalCategory.Retired]: 'Retraité',
  [BeneficiarySocioProfessionalCategory.Employed]: 'Salarié',
  [BeneficiarySocioProfessionalCategory.NoActivity]:
    'Sans activité (non inscrit à Pôle Emploi)',
  [BeneficiarySocioProfessionalCategory.Other]: 'Autre',
}

export const beneficiarySocioProfessionalCategoryOptions = labelsToOptions(
  beneficiarySocioProfessionalCategoryLabels,
)

export const incomeSourceLabels: {
  [key in IncomeSource]: string
} = {
  [IncomeSource.Aah]: 'AAH',
  [IncomeSource.Apl]: 'APL',
  [IncomeSource.Aspa]: 'ASPA',
  [IncomeSource.IndemnitesJournalieres]: 'Indemnités journalières',
  [IncomeSource.IndemnitesPoleEmploi]: 'Indemnités Pôle Emploi : ARE/ASS',
  [IncomeSource.PensionInvalidite]: "Pension d'invalidité",
  [IncomeSource.PrestationsFamiliales]: 'Prestations familiales',
  [IncomeSource.PrimeActivite]: "Prime d'activité",
  [IncomeSource.Retraite]: 'Retraite',
  [IncomeSource.Rsa]: 'RSA',
  [IncomeSource.Salaire]: 'Salaire',
  [IncomeSource.Autre]: 'Autre',
}

export const incomeSourceOptions = labelsToOptions(incomeSourceLabels)

export const beneficiaryProtectionMeasureLabels: {
  [key in BeneficiaryProtectionMeasure]: string
} = {
  [BeneficiaryProtectionMeasure.CuratelleSimple]: 'Curatelle simple',
  [BeneficiaryProtectionMeasure.CuratelleRenforcee]: 'Curatelle renforcée',
  [BeneficiaryProtectionMeasure.HabilitationDuConjoint]:
    'Habilitation du conjoint',
  [BeneficiaryProtectionMeasure.HabilitationFamiliale]:
    'Habilitation familiale',
  [BeneficiaryProtectionMeasure.MandatDeProtectionFuture]:
    'Mandat de protection future',
  [BeneficiaryProtectionMeasure.MesureAccompagnement]:
    "Mesure d'accompagnement (Masp/Maj/MJAGBF)",
  [BeneficiaryProtectionMeasure.SauvegardeDeJustice]: 'Sauvegarde de justice',
  [BeneficiaryProtectionMeasure.Tutelle]: 'Tutelle',
}

export const beneficiaryProtectionMeasureOptions = labelsToOptions(
  beneficiaryProtectionMeasureLabels,
)

export const beneficiaryOrientationTypeLabels: {
  [key in BeneficiaryOrientationType]: string
} = {
  [BeneficiaryOrientationType.Association]: 'Orientation Association',
  [BeneficiaryOrientationType.Departement]: 'Orientation Département',
  [BeneficiaryOrientationType.Elu]: 'Orientation Élu',
  [BeneficiaryOrientationType.Tiers]: "Signalement d'un tiers",
  [BeneficiaryOrientationType.Spontanee]: 'Spontanée',
  [BeneficiaryOrientationType.SuiviCabinet]: 'Suivi cabinet',
  [BeneficiaryOrientationType.Autre]: 'Autre',
}

export const beneficiaryOrientationTypeOptions = labelsToOptions(
  beneficiaryOrientationTypeLabels,
)

export const PensionOrganisations = [
  'AGIRC ARRCO',
  'AG2R',
  'CNAV/CARSAT',
  'CIPAV',
  'CNRACL',
  'EDF',
  'IRCANTEC',
  'KLESIA',
  'SRE',
  'SSI (ex-RSI)',
  'Malakoff Humanis',
  'MSA',
  'ProBTP',
  'Retraite des mines',
  'Autre(s)',
] as const
export type PensionOrganisation = (typeof PensionOrganisations)[number]
export const pensionOrganisationOptions = arrayToOptions(PensionOrganisations)
