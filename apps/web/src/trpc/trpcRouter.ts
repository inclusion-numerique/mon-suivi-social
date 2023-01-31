import { prismaClient } from '@mss/web/prismaClient'
import { v4 } from 'uuid'
import z from 'zod'
import { protectedProcedure, router } from './trpc'
import { BeneficiaryDataValidation } from '@mss/web/beneficiary/beneficiary'
import { generateFileNumber } from '@mss/web/beneficiary/generateFileNumber'
import { SessionUser, SessionUserAgent } from '@mss/web/auth/sessionUser'
import { AddDocumentDataValidation } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/AddDocumentData'
import {
  createSignedGetUrl,
  createSignedUploadUrl,
} from '@mss/web/server/createSignedUrl'
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
import { EditStructureFeatureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { EditStructureFeatureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import { detailedDiff } from 'deep-object-diff'
import { CreateFollowupTypeFeatureClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { computeArrayDiff } from '@mss/web/utils/diff'

const enforceUserHasAccessToStructure = (
  user: SessionUser,
  structureId: string,
): user is SessionUserAgent => {
  if (!user.structureId || structureId !== user.structureId) {
    throw forbiddenError()
  }
  return true
}

const enforceUserHasStructure = (user: SessionUser): string => {
  if (!user.structureId) {
    throw forbiddenError()
  }
  return user.structureId
}

const tokenToSearchCondition = (token: string) => {
  return {
    contains: token,
    mode: 'insensitive',
  }
}

const beneficiarySecurityTargetSelect = {
  id: true,
  structureId: true,
  referents: { select: { id: true } },
} as const

const beneficiarySecurityTargetInclude = {
  select: beneficiarySecurityTargetSelect,
} as const

const getBeneficiarySecurityTarget = (id: string) =>
  prismaClient.beneficiary.findUnique({
    where: { id },
    select: beneficiarySecurityTargetSelect,
  })

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input: { query }, ctx: { user } }) => {
      const structureId = enforceUserHasStructure(user)

      // TODO unit test
      const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

      const fields = [
        'firstName',
        'birthName',
        'usualName',
        'fileNumber',
      ] as const

      const searchConditions = tokens.map((token) => ({
        OR: fields.map((field) => ({
          [field]: tokenToSearchCondition(token),
        })),
      }))

      // TODO benchmark this and stress tes, then create indexes for cas-insensitive filtering.
      // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
      const beneficiaries = await prismaClient.beneficiary.findMany({
        where: {
          structureId,
          AND: searchConditions,
        },
        orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
        select: {
          id: true,
          usualName: true,
          firstName: true,
          birthName: true,
          fileNumber: true,
        },
      })

      return { beneficiaries }
    }),
  add: protectedProcedure
    .input(BeneficiaryDataValidation)
    .mutation(
      async ({
        input: {
          status,
          aidantConnectAuthorized,
          structureId,
          additionalInformation,
        },
        ctx: { user },
      }) => {
        enforceUserHasAccessToStructure(user, structureId)
        const id = v4()
        const fileNumber = generateFileNumber()
        const beneficiary = await prismaClient.beneficiary.create({
          data: {
            id,
            structureId,
            fileNumber,
            status,
            // TODO Add referents
            aidantConnectAuthorized,
            additionalInformation,
          },
        })

        return { beneficiary }
      },
    ),
  document: router({
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

        return {}
      }),
  }),
})

const structureRouter = router({
  edit: protectedProcedure
    .input(EditStructureFeatureClient.dataValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const structureId = input.id

      if (!EditStructureFeatureClient.securityCheck(user, { structureId })) {
        throw forbiddenError()
      }

      const serverState = await EditStructureFeatureServer.getServerState({
        structureId,
      })
      const initialData =
        EditStructureFeatureClient.dataFromServerState(serverState)

      const diff = detailedDiff(initialData, input)

      const followupsDiff = computeArrayDiff(
        initialData.proposedFollowupTypes,
        input.proposedFollowupTypes,
      )

      const { id, proposedFollowupTypes, ...data } = input

      await prismaClient.mutationLog.create({
        data: {
          id: v4(),
          byId: user.id,
          targetStructureId: structureId,
          name: 'structure.edit',
          data: JSON.stringify(diff),
        },
      })

      const updated = await prismaClient.structure.update({
        where: { id: structureId },
        data: {
          ...data,
          proposedFollowupTypes: {
            createMany: {
              data: followupsDiff.added.map((followupTypeId) => ({
                followupTypeId,
              })),
              skipDuplicates: true,
            },
            deleteMany: {
              structureId,
              followupTypeId: { in: followupsDiff.removed },
            },
          },
        },
      })

      if (followupsDiff.removed.length > 0) {
        // If this is a custom followup type owned by this structure, delete it
        await prismaClient.followupType.deleteMany({
          where: {
            ownedByStructureId: structureId,
            id: { in: followupsDiff.removed },
          },
        })
      }

      return { structure: updated }
    }),
  createFollowupType: protectedProcedure
    .input(CreateFollowupTypeFeatureClient.dataValidation)
    .mutation(async ({ input: { structureId, name }, ctx: { user } }) => {
      if (!EditStructureFeatureClient.securityCheck(user, { structureId })) {
        throw forbiddenError()
      }

      const followupType = await prismaClient.followupType.create({
        data: {
          id: v4(),
          legallyRequired: false,
          ownedByStructureId: structureId,
          name,
          createdById: user.id,
        },
      })

      return { followupType }
    }),
})

export const appRouter = router({
  beneficiary: beneficiaryRouter,
  structure: structureRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
