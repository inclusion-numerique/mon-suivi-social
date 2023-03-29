import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { DocumentType } from '@prisma/client'
import { canAddBeneficiaryDocument } from '@mss/web/security/rules'
import { formatByteSize } from '@mss/web/utils/formatByteSize'
import { errorMessages } from '@mss/web/utils/zod'
import {
  documentFileAllowedTypes,
  documentFileMaxSize,
  DocumentTags,
} from '@mss/web/client/options/document'

const documentSizeValidationErrorMessage = `La taille du document doit être inférieure à ${formatByteSize(
  documentFileMaxSize,
)}`

const documentMimeTypeValidationErrorMessage =
  "Ce type de document n'est pas accepté"
export const documentMimeTypeValidation = z
  .string()
  .refine((value) => documentFileAllowedTypes.includes(value))

export const documentSizeValidation = z
  .number()
  .int()
  .max(documentFileMaxSize, documentSizeValidationErrorMessage)

export const AddDocumentClient = createMutationClient({
  name: 'document.add',
  title: 'Ajout de document',
  securityCheck: canAddBeneficiaryDocument,
  inputValidation: z.object({
    beneficiaryId: z.string(errorMessages),
    type: z.nativeEnum(DocumentType, {
      ...errorMessages,
      required_error: 'Veuillez renseigner le type du document',
    }),
    tags: z.array(z.enum(DocumentTags)),
    confidential: z.boolean().default(false),
    file: z.object({
      key: z.string({ required_error: 'Veuillez téléverser un document' }),
      mimeType: documentMimeTypeValidation,
      name: z.string(),
      size: documentSizeValidation,
    }),
  }),
  beneficiaryAnonymization: ({ file }) => ({
    file: file
      ? {
          key: '',
          name: '',
          size: file.size,
          mimeType: file.mimeType,
        }
      : undefined,
  }),
  fieldLabels: {
    beneficiaryId: 'Bénéficiaire',
    type: 'Type de document',
    confidential: 'Confidentiel',
    tags: 'Thèmes',
    file: 'Document',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddDocumentClient = typeof AddDocumentClient

// Used in browser forms
// TODO is there a better way to reuse documentSizeValidation and documentMimeTypeValidation ?
export const AddDocumentWithBrowserUploadValidation =
  AddDocumentClient.inputValidation.omit({ file: true }).extend({
    file: z
      .custom<File>()
      .refine(
        (value) => !!value && value instanceof File && value.name.length > 0,
        'Veuillez choisir un document',
      )
      .refine(
        (value) =>
          !!value &&
          value instanceof File &&
          documentSizeValidation.safeParse(value.size).success,
        documentSizeValidationErrorMessage,
      )
      .refine(
        (value) =>
          !!value &&
          value instanceof File &&
          documentMimeTypeValidation.safeParse(value.type).success,
        documentMimeTypeValidationErrorMessage,
      ),
  })

export type AddDocumentWithBrowserUploadData = z.infer<
  typeof AddDocumentWithBrowserUploadValidation
>
