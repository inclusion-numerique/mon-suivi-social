import { z } from 'zod'
import { DocumentType } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'
import { formatByteSize } from '@mss/web/utils/formatByteSize'

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

const BaseAddDocumentDataValidation = z.object({
  beneficiaryId: z.string(),
  type: z.nativeEnum(DocumentType, {
    required_error: 'Veuillez renseigner le type du document',
  }),
  tags: z.array(z.enum(DocumentTags)),
  confidential: z.boolean(),
})

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

const documentSizeValidationErrorMessage = `La taille du document doit être inférieure à ${formatByteSize(
  documentFileMaxSize,
)}`
export const documentSizeValidation = z
  .number()
  .int()
  .max(documentFileMaxSize, documentSizeValidationErrorMessage)

const documentMimeTypeValidationErrorMessage =
  "Ce type de document n'est pas accepté"
export const documentMimeTypeValidation = z
  .string()
  .refine((value) => documentFileAllowedTypes.includes(value))

// Used for mutation validation
export const AddDocumentDataValidation = BaseAddDocumentDataValidation.extend({
  file: z.object({
    key: z.string({ required_error: 'Veuillez téléverser un document' }),
    mimeType: documentMimeTypeValidation,
    name: z.string(),
    size: documentSizeValidation,
  }),
})

// Used in browser forms
// TODO is there a better way to reuse documentSizeValidation and documentMimeTypeValidation ?
export const AddDocumentDataValidationWithUpload =
  BaseAddDocumentDataValidation.extend({
    file: z
      .custom<File>()
      .refine(
        (value) => !!value && value instanceof File && value.name.length > 0,
        'Veuillez choisir un document',
      )
      .refine(
        (value) => documentSizeValidation.safeParse(value.size).success,
        documentSizeValidationErrorMessage,
      )
      .refine(
        (value) => documentMimeTypeValidation.safeParse(value.type).success,
        documentMimeTypeValidationErrorMessage,
      ),
  })

export type AddDocumentData = z.infer<typeof AddDocumentDataValidation>
export type AddDocumentDataWithUpload = z.infer<
  typeof AddDocumentDataValidationWithUpload
>
