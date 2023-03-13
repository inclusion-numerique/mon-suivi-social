import { DocumentType } from '@prisma/client'
import { labelsToOptions } from '../utils/options'

// Max size in bytes
export const documentFileMaxSize = 15_000_000
export const documentFileAllowedTypes = [
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
]

export const DocumentTags = [
  'emploi',
  'santeHandicap',
  'maintienADomicile',
  'budgetRessources',
  'logement',
  'impot',
  'justice',
  'retraite',
  'prestationsSociales',
] as const

export type DocumentTag = (typeof DocumentTags)[number]

export const DocumentTypes = Object.values(DocumentType) satisfies string[]

export const documentTypeLabels: {
  [scope in DocumentType]: string
} = {
  [DocumentType.Cerfa]: 'CERFA',
  [DocumentType.HistoriqueCourrier]: 'Historique Courrier',
  [DocumentType.Justificatifs]: 'Justificatifs',
  [DocumentType.Rapports]: 'Rapports',
}

export const documentTypeOptions = labelsToOptions(documentTypeLabels)

export const documentTagLabels: { [scope in DocumentTag]: string } = {
  budgetRessources: 'Budget-Ressources',
  emploi: 'Emploi',
  impot: 'Impôt',
  justice: 'Justice',
  logement: 'Logement',
  maintienADomicile: 'Maintien à domicile',
  prestationsSociales: 'Prestations sociales',
  retraite: 'Retraite',
  santeHandicap: 'Santé-Handicap',
}

export const documentTagOptions = labelsToOptions(documentTagLabels)
