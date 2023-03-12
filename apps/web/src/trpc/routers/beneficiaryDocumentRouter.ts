import { protectedProcedure, router } from '@mss/web/trpc/trpc'
import {
  beneficiarySecurityTargetInclude,
  getBeneficiarySecurityTarget,
} from '@mss/web/security/getBeneficiarySecurityTarget'
import {
  forbiddenError,
  invalidError,
  notfoundError,
} from '@mss/web/trpc/trpcErrors'
import {
  canAddBeneficiaryDocument,
  canViewBeneficiaryDocuments,
} from '@mss/web/security/rules'
import { prismaClient } from '@mss/web/prismaClient'
import z from 'zod'
import {
  createSignedGetUrl,
  createSignedUploadUrl,
} from '@mss/web/server/createSignedUrl'
import { AddDocumentClient } from '@mss/web/features/document/addDocument.client'
import { AddDocumentServer } from '@mss/web/features/document/addDocument.server'
import { EditDocumentClient } from '@mss/web/features/document/editDocument.client'
import { EditDocumentServer } from '@mss/web/features/document/editDocument.server'
import { DeleteDocumentServer } from '@mss/web/features/document/deleteDocument.server'
import { DeleteDocumentClient } from '@mss/web/features/document/deleteDocument.client'
import { ServerWebAppConfig } from '@mss/web/webAppConfig'

export const beneficiaryDocumentRouter = router({
  add: protectedProcedure
    .input(AddDocumentClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }
      return AddDocumentServer.execute({
        input,
        user,
        target,
        securityParams: {},
        structureId: target.structureId,
      })
    }),
  edit: protectedProcedure
    .input(EditDocumentClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }
      return EditDocumentServer.execute({
        input,
        user,
        target,
        getServerStateInput: input,
        securityParams: {},
        structureId: target.structureId,
      })
    }),
  createUploadUrl: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        mimeType: z.string(),
        beneficiaryId: z.string(),
      }),
    )
    .mutation(
      async ({ input: { name, beneficiaryId, mimeType }, ctx: { user } }) => {
        const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

        if (!beneficiary) {
          throw invalidError()
        }

        if (!canAddBeneficiaryDocument(user, beneficiary)) {
          throw forbiddenError()
        }

        const directory = `users/${user.id}/uploaded-documents`

        // TODO Mutation log
        const { url, key } = await createSignedUploadUrl({
          name,
          type: mimeType,
          directory,
          bucket: ServerWebAppConfig.S3.documentsBucketId,
        })

        return { url, key }
      },
    ),
  createViewUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input: { key }, ctx: { user } }) => {
      const document = await prismaClient.document.findUnique({
        where: { key },
        include: { beneficiary: beneficiarySecurityTargetInclude },
      })

      if (!document) {
        throw notfoundError()
      }
      if (!canViewBeneficiaryDocuments(user, document.beneficiary)) {
        throw forbiddenError()
      }

      // TODO Mutation or audit log
      const { url } = await createSignedGetUrl({
        key,
        bucket: ServerWebAppConfig.S3.documentsBucketId,
      })

      return { url }
    }),
  delete: protectedProcedure
    .input(DeleteDocumentClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const document = await prismaClient.document.findUnique({
        where: { key: input.documentKey },
        include: { beneficiary: beneficiarySecurityTargetInclude },
      })
      if (!document) {
        throw invalidError('Document not found')
      }

      return DeleteDocumentServer.execute({
        input,
        user,
        target: document.beneficiary,
        securityParams: {},
        structureId: document.beneficiary.structureId,
      })
    }),
})
