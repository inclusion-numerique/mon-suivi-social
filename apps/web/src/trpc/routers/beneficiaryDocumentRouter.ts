import { protectedProcedure, router } from '@mss/web/trpc/trpc'
import { AddDocumentDataValidation } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/AddDocumentData'
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
  canDeleteBeneficiaryDocument,
  canViewBeneficiaryDocuments,
} from '@mss/web/security/rules'
import { prismaClient } from '@mss/web/prismaClient'
import z from 'zod'
import {
  createSignedGetUrl,
  createSignedUploadUrl,
} from '@mss/web/server/createSignedUrl'
import { deleteUploadedFile } from '@mss/web/server/s3/deleteUploadedFile'
import * as Sentry from '@sentry/nextjs'

export const beneficiaryDocumentRouter = router({
  add: protectedProcedure
    .input(AddDocumentDataValidation)
    .mutation(
      async ({
        input: { type, beneficiaryId, confidential, tags, file },
        ctx: { user },
      }) => {
        const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

        if (!beneficiary) {
          throw invalidError()
        }

        if (!canAddBeneficiaryDocument(user, beneficiary)) {
          throw forbiddenError()
        }

        const document = await prismaClient.document.create({
          data: {
            beneficiaryId,
            type,
            confidential,
            tags,
            createdById: user.id,
            ...file,
          },
        })

        return { document }
      },
    ),
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
      })

      return { url }
    }),
  delete: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input: { key }, ctx: { user } }) => {
      const document = await prismaClient.document.findUnique({
        where: { key },
        include: { beneficiary: beneficiarySecurityTargetInclude },
      })

      if (!document) {
        throw notfoundError()
      }

      if (!canDeleteBeneficiaryDocument(user, document.beneficiary)) {
        throw forbiddenError()
      }

      // TODO Mutation log
      // TODO Delete from bucket
      await prismaClient.document.delete({ where: { key } })
      deleteUploadedFile({ key }).catch((err) =>
        Sentry.captureException(err, { tags: { sensitive: true } }),
      )

      return {}
    }),
})
