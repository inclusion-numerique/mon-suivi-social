import { createMutationServer } from '@mss/web/features/createMutation.server'
import { v4 } from 'uuid'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'

export const AddHelpRequestServer = createMutationServer({
  client: AddHelpRequestClient,
  executeMutation: async ({ input, transaction, user }) => {
    const {
      beneficiaryId,
      type,
      documents,
      financialSupport,
      externalStructure,
      ...data
    } = input

    const id = v4()

    // TODO better way to pass along structureId in mutation context extra props
    const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: { structureId: true },
    })

    const helpRequest = await transaction.helpRequest.create({
      data: {
        id,
        structureId,
        beneficiaryId,
        typeId: type,
        financialSupport: financialSupport === 'true',
        externalStructure: externalStructure === 'true',
        documents: {
          connect: documents.map((key) => ({ key })),
        },
        createdById: user.id,
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
    input: { beneficiaryId },
    result: {
      helpRequest: { id, structureId },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

export type AddHelpRequestServer = typeof AddHelpRequestServer
