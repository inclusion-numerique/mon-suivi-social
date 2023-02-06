import { prismaClient } from '@mss/web/prismaClient'
import { MutationDiff } from '@mss/web/features/mutationLog'
import { ArchiveBeneficiaryClient } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.client'
import { notfoundError } from '@mss/web/trpc/trpcErrors'
import { getAnonymizationForFeature } from '@mss/web/features/beneficiary/archiveBeneficiary/mutationLogAnonymization'
import * as Sentry from '@sentry/nextjs'
import { deleteUploadedFile } from '@mss/web/server/s3/deleteUploadedFile'
import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'

export const ArchiveBeneficiaryServer = createMutationServerWithInitialState({
  client: ArchiveBeneficiaryClient,
  getServerState: async ({ input: { beneficiaryId } }) => {
    const beneficiary = await prismaClient.beneficiary.findUnique({
      where: { id: beneficiaryId },
      include: {
        relatives: true,
        documents: true,
        followups: true,
        helpRequests: true,
        targetForMutations: true,
      },
    })

    if (!beneficiary) {
      throw notfoundError()
    }

    return { beneficiary }
  },
  mutationLogInfo: ({ structureId, beneficiaryId }) => ({
    targetId: structureId,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
  dataFromServerState: ({ beneficiary: { id } }) => ({
    beneficiaryId: id,
  }),
  // TODO it is critical to do an integration test for this method to ensure proper anonymization
  executeMutation: async ({ serverState, input, transaction, user }) => {
    const { beneficiaryId } = input
    const {
      beneficiary: { targetForMutations, documents },
    } = serverState

    const beneficiaryAnonymization = transaction.beneficiary.update({
      where: { id: beneficiaryId },
      data: {
        archived: new Date(),
        archivedById: user.id,
        firstName: null,
        birthName: null,
        // TODO other fields
        relatives: {
          updateMany: [
            {
              where: {},
              data: {
                firstName: null,
                lastName: null,
                city: null,
                phone: null,
                email: null,
                caregiver: null,
                hosted: null,
                relationship: null,
                additionalInformation: null,
              },
            },
          ],
        },
        documents: {
          updateMany: [
            {
              where: {},
              data: {
                name: '',
                key: '',
                tags: [],
                mimeType: 'deleted',
              },
            },
          ],
        },
        followups: {
          updateMany: [
            {
              where: {},
              data: {
                synthesis: null,
                privateSynthesis: null,
                thirdPersonName: null,
              },
            },
          ],
        },
        helpRequests: {
          updateMany: [
            {
              where: {},
              data: {
                synthesis: null,
                privateSynthesis: null,
              },
            },
          ],
        },
      },
    })

    // For each mutation that targeted this beneficiary, we execute anonymization function on diffs
    // So we keep log for audit and usage statistics, but without personal data
    const mutationLogAnonymizations = targetForMutations.map(
      ({ id, name, diff }) => {
        const anonymization = getAnonymizationForFeature(name)
        if (!anonymization) {
          Sentry.captureException(
            `Missing anonymization function for feature ${name}`,
            {
              tags: {
                sensitive: true,
                feature: name,
              },
            },
          )
          return name
        }
        const sensitiveDiff = diff as any as MutationDiff
        const anonymizedDiff: MutationDiff = {
          added: sensitiveDiff.added ? anonymization(sensitiveDiff.added) : {},
          updated: sensitiveDiff.updated
            ? anonymization(sensitiveDiff.updated)
            : {},
          deleted: sensitiveDiff.deleted
            ? anonymization(sensitiveDiff.deleted)
            : {},
        }

        return transaction.mutationLog.update({
          where: { id },
          data: {
            diff: JSON.stringify(anonymizedDiff),
          },
        })
      },
    )
    await Promise.all([beneficiaryAnonymization, ...mutationLogAnonymizations])

    // Asynchronously delete all uploaded files
    documents.forEach((document) => {
      deleteUploadedFile(document).catch((error) => {
        // Notify dev team in case of deletion error for manual action
        Sentry.captureException(error, {
          tags: {
            sensitive: true,
            feature: ArchiveBeneficiaryClient.name,
          },
        })
      })
    })

    // TODO return a report of count of stuff anonymized ? And if failures, return failed feature anonymizations?
    return {}
  },
})
