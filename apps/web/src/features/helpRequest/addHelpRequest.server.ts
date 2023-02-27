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
      dueDate,
      openingDate,
      decisionDate,
      handlingDate,
      dispatchDate,
      paymentDate,
      examinationDate,
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
        // TODO Helper for date string => Date
        dueDate: dueDate ? new Date(dueDate) : null,
        openingDate: new Date(openingDate),
        decisionDate: decisionDate ? new Date(decisionDate) : null,
        handlingDate: handlingDate ? new Date(handlingDate) : null,
        dispatchDate: dispatchDate ? new Date(dispatchDate) : null,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        examinationDate: examinationDate ? new Date(examinationDate) : null,
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddHelpRequestServer = typeof AddHelpRequestServer
