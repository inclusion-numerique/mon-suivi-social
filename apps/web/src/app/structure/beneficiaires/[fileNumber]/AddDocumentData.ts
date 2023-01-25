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
  beneficiaryId: z.string(),
  type: z.nativeEnum(DocumentType, {
    required_error: 'Veuillez renseigner le type du document',
  }),
  tags: z.array(z.enum(DocumentTags)),
  confidential: z.boolean(),
  mimeType: z.string(),
  name: z.string(),
  size: z.number().int(),
})

export const AddDocumentDataValidationWithUpload =
  AddDocumentDataValidation.extend({
    file: z.object({
      mimeType: z.string(),
      name: z.string(),
      size: z.number().int(),
    }),
  })

export type AddDocumentData = z.infer<typeof AddDocumentDataValidation>
export type AddDocumentDataWithUpload = z.infer<
  typeof AddDocumentDataValidationWithUpload
>
