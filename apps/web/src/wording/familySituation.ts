import { BeneficiaryFamilySituation } from '@prisma/client'

export const familySituationWording: {
  [familySituation in BeneficiaryFamilySituation]: string
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

export const getFamilySituationWording = (
  familySituation: BeneficiaryFamilySituation | null,
): string =>
  familySituation ? familySituationWording[familySituation] : 'Non renseigné'
