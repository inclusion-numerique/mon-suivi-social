import { prismaClient } from '@mss/web/server/prisma/prismaClient'
import { MutationDiff } from '@mss/web/features/mutationLog'
import { ArchiveBeneficiaryClient } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.client'
import { invalidError, notfoundError } from '@mss/web/server/trpcErrors'
import {
  applyAnonymization,
  getAnonymizationForFeature,
} from '@mss/web/features/beneficiary/archiveBeneficiary/mutationLogAnonymization'
import * as Sentry from '@sentry/nextjs'
import { deleteUploadedFile } from '@mss/web/lib/s3/deleteUploadedFile'
import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { Prisma } from '@prisma/client'

export const ArchiveBeneficiaryServer = createMutationServerWithInitialState({
  client: ArchiveBeneficiaryClient,
  getServerState: async ({ beneficiaryId }: { beneficiaryId: string }) => {
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
      beneficiary: { archived, targetForMutations, documents },
    } = serverState

    if (archived) {
      throw invalidError('Ce bénéficiaire est déjà archivé')
    }

    const beneficiaryAnonymization = transaction.beneficiary.update({
      where: { id: beneficiaryId },
      data: {
        archived: new Date(),
        archivedById: user.id,
        title: null,
        firstName: null,
        usualName: null,
        birthName: null,
        birthDate: null,
        birthPlace: null,
        deathDate: null,
        gender: null,
        nationality: null,
        accomodationMode: null,
        accomodationName: null,
        accomodationAdditionalInformation: null,
        street: null,
        streetNumber: null,
        addressComplement: null,
        zipcode: null,
        city: null,
        region: null,
        noPhone: null,
        phone1: null,
        phone2: null,
        email: null,
        familySituation: null,
        caregiver: null,
        minorChildren: null,
        majorChildren: null,
        mobility: null,
        administration: null,
        minister: null,
        additionalInformation: null,
        doctor: null,
        healthAdditionalInformation: null,
        socialSecurityNumber: null,
        insurance: null,
        occupation: null,
        employer: null,
        employerSiret: null,
        mainIncomeSource: [],
        mainIncomeAmount: null,
        partnerMainIncomeSource: [],
        partnerMainIncomeAmount: null,
        majorChildrenMainIncomeSource: [],
        majorChildrenMainIncomeAmount: null,
        unemploymentNumber: null,
        pensionOrganisations: [],
        cafNumber: null,
        bank: null,
        funeralContract: null,
        protectionMeasure: null,
        representative: null,
        prescribingStructure: null,
        orientationType: null,
        orientationStructure: null,
        serviceProviders: null,
        involvedPartners: null,
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
                place: null,
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
                refusalReason: null,
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
        const sensitiveDiff = diff as never as MutationDiff
        const anonymizedDiff: Prisma.JsonObject = {
          added: applyAnonymization(sensitiveDiff.added, anonymization),
          updated: applyAnonymization(sensitiveDiff.updated, anonymization),
          deleted: applyAnonymization(sensitiveDiff.deleted, anonymization),
        } satisfies MutationDiff

        return transaction.mutationLog.update({
          where: { id },
          data: {
            diff: anonymizedDiff,
          },
        })
      },
    )
    await Promise.all([beneficiaryAnonymization, ...mutationLogAnonymizations])

    // Asynchronously delete all uploaded files
    for (const document of documents) {
      deleteUploadedFile(document).catch((error) => {
        // Notify dev team in case of deletion error for manual action
        Sentry.captureException(error, {
          tags: {
            sensitive: true,
            feature: ArchiveBeneficiaryClient.name,
          },
        })
      })
    }

    // TODO return a report of count of stuff anonymized ? And if failures, return failed feature anonymizations?
    return {}
  },
})
