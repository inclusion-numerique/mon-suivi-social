import { Prisma } from '@prisma/client'
import { CreationMutationFeature } from '@mss/web/features/feature'
import { AddBeneficiaryWithGeneralInfoFeatureClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'

const executeMutation = async ({
  id,
  input,
  transaction,
}: {
  input: AddBeneficiaryWithGeneralInfoFeatureClient.Input
  transaction: Prisma.TransactionClient
  id: string
}) => {
  const { structureId, ...data } = input

  const beneficiary = await transaction.beneficiary.create({
    data: {
      id,
      structureId,
      ...data,
    },
  })

  return { beneficiary }
}

export const AddBeneficiaryWithGeneralInfoFeatureServer = {
  executeMutation,
}

export namespace AddBeneficiaryWithGeneralInfoFeatureServer {
  export type MutationResult = Awaited<ReturnType<typeof executeMutation>>
}

export const AddBeneficiaryWithGeneralInfoFeature = {
  ...AddBeneficiaryWithGeneralInfoFeatureClient,
  ...AddBeneficiaryWithGeneralInfoFeatureServer,
} satisfies CreationMutationFeature<
  AddBeneficiaryWithGeneralInfoFeatureClient.Input,
  {},
  AddBeneficiaryWithGeneralInfoFeatureServer.MutationResult
>
