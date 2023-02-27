import { createMutationServer } from '@mss/web/features/createMutation.server'
import { v4 } from 'uuid'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'

export const AddFollowupServer = createMutationServer({
  client: AddFollowupClient,
  executeMutation: async ({ input, transaction, user }) => {
    const { beneficiaryId, types, documents, date, dueDate, ...data } = input

    const id = v4()

    // TODO better way to pass along structureId in mutation context extra props
    const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: { structureId: true },
    })

    const followup = await transaction.followup.create({
      data: {
        id,
        structureId,
        beneficiaryId,
        // TODO Helper for date string => Date
        date: new Date(date),
        dueDate: dueDate ? new Date(dueDate) : null,
        types: {
          connect: types.map((type) => ({ id: type })),
        },
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

    return { followup }
  },
  mutationLogInfo: ({
    input: { beneficiaryId },
    result: {
      followup: { id, structureId },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddFollowupServer = typeof AddFollowupServer
