import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { prismaClient } from '@mss/web/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'

export const EditBeneficiaryFullDataServer =
  createMutationServerWithInitialState({
    client: EditBeneficiaryFullDataClient,
    getServerState: async ({ beneficiaryId }: { beneficiaryId: string }) =>
      prismaClient.beneficiary.findUniqueOrThrow({
        where: { id: beneficiaryId },
        // Only select general info
        include: {
          referents: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      }),
    dataFromServerState: ({
      id,
      referents,
      birthDate,
      deathDate,
      mainIncomeAmount,
      partnerMainIncomeAmount,
      majorChildrenMainIncomeAmount,
      ...data
    }): MutationInput<EditBeneficiaryFullDataClient> => {
      return {
        beneficiaryId: id,
        referents: referents.map(({ id }) => id),
        birthDate: birthDate?.toISOString(),
        mainIncomeAmount: mainIncomeAmount?.toNumber(),
        partnerMainIncomeAmount: partnerMainIncomeAmount?.toNumber(),
        majorChildrenMainIncomeAmount:
          majorChildrenMainIncomeAmount?.toNumber(),
        ...removeNullAndUndefinedValues(data),
      }
    },
    executeMutation: async ({ input, transaction, initialInput }) => {
      const { beneficiaryId, referents, ...data } = input

      // TODO Before and after for referents
      const beneficiary = await transaction.beneficiary.update({
        where: { id: beneficiaryId },
        data: {
          ...data,
        },
      })

      return { beneficiary }
    },
    mutationLogInfo: ({
      input: { beneficiaryId },
      result: {
        beneficiary: { structureId },
      },
    }) => ({
      targetId: structureId,
      targetStructureId: structureId,
      targetBeneficiaryId: beneficiaryId,
    }),
  })

export type EditBeneficiaryFullDataServer = typeof EditBeneficiaryFullDataServer
