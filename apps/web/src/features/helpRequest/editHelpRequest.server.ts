import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import { prismaClient } from '@mss/web/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'
import { computeArrayDiff } from '@mss/web/utils/diff'
import { booleanToString, stringToBoolean } from '@mss/web/utils/booleanString'

export const EditHelpRequestServer = createMutationServerWithInitialState({
  client: EditHelpRequestClient,
  getServerState: async ({
    helpRequestId,
    includeSynthesis,
    includePrivateSynthesis,
  }: {
    helpRequestId: string
    includeSynthesis: boolean
    includePrivateSynthesis: boolean
  }) => {
    const helpRequest = await prismaClient.helpRequest.findUniqueOrThrow({
      where: { id: helpRequestId },
      // Only select general info
      include: {
        type: true,
        documents: true,
      },
    })

    if (!includeSynthesis) {
      helpRequest.synthesis = null
    }
    if (!includePrivateSynthesis) {
      helpRequest.privateSynthesis = null
    }

    return helpRequest
  },
  dataFromServerState: ({
    id,
    type,
    typeId,
    structureId,
    documents,
    financialSupport,
    externalStructure,
    askedAmount,
    allocatedAmount,
    created,
    updated,
    createdById,
    ...data
  }): MutationInput<EditHelpRequestClient> => {
    return {
      helpRequestId: id,
      type: type.id,
      documents: documents.map(({ key }) => key),
      financialSupport: booleanToString(financialSupport) ?? undefined,
      externalStructure: booleanToString(externalStructure) ?? undefined,
      askedAmount: askedAmount?.toNumber(),
      allocatedAmount: allocatedAmount?.toNumber(),
      ...removeNullAndUndefinedValues(data),
    }
  },
  executeMutation: async ({ input, transaction, initialInput }) => {
    const {
      helpRequestId,
      beneficiaryId,
      type,
      documents,
      financialSupport,
      externalStructure,
      ...data
    } = input

    const documentsDiff = computeArrayDiff(
      initialInput.documents,
      input.documents,
    )

    const helpRequest = await transaction.helpRequest.update({
      where: { id: helpRequestId },
      data: {
        updated: new Date(),
        typeId: type,
        financialSupport: stringToBoolean(financialSupport),
        externalStructure: stringToBoolean(externalStructure),
        documents: {
          connect: documentsDiff.added.map((key) => ({ key })),
          disconnect: documentsDiff.removed.map((key) => ({ key })),
        },
        ...data,
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            fileNumber: true,
          },
        },
      },
    })

    return { helpRequest }
  },
  mutationLogInfo: ({
    input: { beneficiaryId, helpRequestId },
    result: {
      helpRequest: { structureId },
    },
  }) => ({
    targetId: helpRequestId,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditHelpRequestServer = typeof EditHelpRequestServer
