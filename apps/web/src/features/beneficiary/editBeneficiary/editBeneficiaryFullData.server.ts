import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { prismaClient } from '@mss/web/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'
import { computeArrayDiff } from '@mss/web/utils/diff'
import { Nationalities } from '@mss/web/constants/nationality'
import { PensionOrganisation } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'

export const EditBeneficiaryFullDataServer =
  createMutationServerWithInitialState({
    client: EditBeneficiaryFullDataClient,
    getServerState: async ({ beneficiaryId }: { beneficiaryId: string }) =>
      prismaClient.beneficiary.findUniqueOrThrow({
        where: { id: beneficiaryId },
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
          relatives: true,
        },
      }),
    dataFromServerState: ({
      id,
      structureId,
      fileNumber,
      referents,
      mainIncomeAmount,
      partnerMainIncomeAmount,
      majorChildrenMainIncomeAmount,
      pensionOrganisations,
      nationality,
      created,
      updated,
      createdById,
      ...data
    }): MutationInput<EditBeneficiaryFullDataClient> => ({
      beneficiaryId: id,
      referents: referents.map((referent) => referent.id),
      nationality: nationality as keyof typeof Nationalities,
      pensionOrganisations: pensionOrganisations as PensionOrganisation[],
      mainIncomeAmount: mainIncomeAmount?.toNumber(),
      partnerMainIncomeAmount: partnerMainIncomeAmount?.toNumber(),
      majorChildrenMainIncomeAmount: majorChildrenMainIncomeAmount?.toNumber(),
      ...removeNullAndUndefinedValues(data),
    }),
    executeMutation: async ({ input, transaction, initialInput }) => {
      const { beneficiaryId, referents, ...data } = input

      const referentsDiff = computeArrayDiff(initialInput.referents, referents)
      const beneficiary = await transaction.beneficiary.update({
        where: { id: beneficiaryId },
        data: {
          updated: new Date(),
          ...data,
          referents: {
            connect: referentsDiff.added.map((id) => ({ id })),
            disconnect: referentsDiff.removed.map((id) => ({ id })),
          },
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
      targetId: beneficiaryId,
      targetStructureId: structureId,
      targetBeneficiaryId: beneficiaryId,
    }),
  })

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditBeneficiaryFullDataServer = typeof EditBeneficiaryFullDataServer
