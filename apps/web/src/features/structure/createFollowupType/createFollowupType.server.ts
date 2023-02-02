import { prismaClient } from '@mss/web/prismaClient'
import { Prisma } from '@prisma/client'
import { CreateFollowupTypeFeatureClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { MutationLogInfo } from '@mss/web/features/mutationLog'
import { CreationMutationFeature } from '@mss/web/features/feature'
import { SecurityRuleGrantee } from '@mss/web/security/rules'

const mutationLogInfo = (
  { structureId }: CreateFollowupTypeFeatureClient.Input,
  { id }: { id: string },
): MutationLogInfo => ({
  name: 'structure.createFollowupType',
  targetId: id,
  targetStructureId: structureId,
})

const executeMutation = async ({
  input,
  user,
  id,
}: {
  input: CreateFollowupTypeFeatureClient.Input
  transaction: Prisma.TransactionClient
  user: SecurityRuleGrantee
  id: string
}) => {
  const { structureId, name } = input

  const followupType = await prismaClient.followupType.create({
    data: {
      id,
      legallyRequired: false,
      ownedByStructureId: structureId,
      name,
      createdById: user.id,
    },
  })

  return { followupType }
}

export const CreateFollowupTypeFeatureServer = {
  mutationLogInfo,
  executeMutation,
}

export namespace CreateFollowupTypeFeatureServer {
  export type MutationResult = Awaited<ReturnType<typeof executeMutation>>
}

export const CreateFollowupTypeFeature = {
  ...CreateFollowupTypeFeatureClient,
  ...CreateFollowupTypeFeatureServer,
} satisfies CreationMutationFeature<
  CreateFollowupTypeFeatureClient.Input,
  {},
  CreateFollowupTypeFeatureServer.MutationResult
>