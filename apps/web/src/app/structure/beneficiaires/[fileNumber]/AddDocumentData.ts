import { z } from 'zod'
import { DocumentType } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'

export const DocumentTypes = Object.values(DocumentType) satisfies string[]

export const documentTypeLabels: {
  [scope in (typeof DocumentTypes)[0]]: string
} = {
  Cerfa: 'CERFA',
  HistoriqueCourrier: 'Historique Courrier',
  Justificatifs: 'Justificatifs',
  Rapports: 'Rapports',
}

export const documentTypeOptions = labelsToOptions(documentTypeLabels)

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

export const AddDocumentDataValidation = z.object({
  key: z.string({ required_error: 'Veuillez uploader le document' }),
  type: z.nativeEnum(DocumentType, {
    required_error: 'Veuillez renseigner le type du document',
  }),
  tags: z.array(z.enum(DocumentTags)),
  confidential: z.boolean(),
})

export type AddDocumentData = z.infer<typeof AddDocumentDataValidation>
