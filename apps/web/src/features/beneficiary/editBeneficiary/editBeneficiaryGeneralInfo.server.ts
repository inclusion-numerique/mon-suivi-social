import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { prismaClient } from '@mss/web/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'

export const EditBeneficiaryGeneralInfoServer =
  createMutationServerWithInitialState({
    client: EditBeneficiaryGeneralInfoClient,
    getServerState: async ({ beneficiaryId }: { beneficiaryId: string }) =>
      prismaClient.beneficiary.findUniqueOrThrow({
        where: { id: beneficiaryId },
        // Only select general info
        select: {
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
          id: true,
          structureId: true,
          aidantConnectAuthorized: true,
          status: true,
          title: true,
          usualName: true,
          birthName: true,
          firstName: true,
          birthDate: true,
          birthPlace: true,
          gender: true,
          nationality: true,
          accomodationMode: true,
          accomodationAdditionalInformation: true,
          city: true,
          zipcode: true,
          region: true,
          streetNumber: true,
          street: true,
          addressComplement: true,
          noPhone: true,
          phone1: true,
          phone2: true,
          email: true,
          familySituation: true,
          minorChildren: true,
          majorChildren: true,
          caregiver: true,
          mobility: true,
          additionalInformation: true,
        },
      }),
    dataFromServerState: ({
      id,
      referents,
      birthDate,
      ...data
    }): MutationInput<EditBeneficiaryGeneralInfoClient> => {
      return {
        beneficiaryId: id,
        referents: referents.map(({ id }) => id),
        birthDate: birthDate?.toISOString(),
        ...removeNullAndUndefinedValues(data),
      }
    },
    executeMutation: async ({ input, transaction }) => {
      const { beneficiaryId, referents, ...data } = input

      const beneficiary = await transaction.beneficiary.update({
        where: { id: beneficiaryId },
        data: {
          ...data,
          referents: {
            connect: referents.map((id) => ({ id })),
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
      targetId: structureId,
      targetStructureId: structureId,
      targetBeneficiaryId: beneficiaryId,
    }),
  })

export type EditBeneficiaryGeneralInfoServer =
  typeof EditBeneficiaryGeneralInfoServer
