import { z, ZodType } from 'zod'
import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { MutationLogInfo } from '@mss/web/features/mutationLog'
import { MutationContext } from '@mss/web/features/feature'
import { addMutationLogToBeneficiaryAnonymization } from '@mss/web/features/beneficiary/archiveBeneficiary/mutationLogAnonymization'
import { Prisma } from '@prisma/client'

type AnonymizationFunction<T> = (sensitiveDiff: T) => Partial<T>
type HumanizeInput<T> = { [key in keyof T]: string }

interface CreateMutationClientOptions<
  Validation extends ZodType,
  SecurityParams = any,
  Name extends string = string,
  Input = z.infer<Validation>,
> {
  name: Name
  inputValidation: Validation
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  beneficiaryAnonymization?: AnonymizationFunction<Input>
  humanizeInput?: HumanizeInput<Input>
}

interface MutationClient<
  Validation extends ZodType,
  SecurityParams = any,
  Name extends string = string,
  Input = z.infer<Validation>,
> {
  name: Name
  inputValidation: Validation
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  beneficiaryAnonymization?: AnonymizationFunction<Input>
  humanizeInput?: HumanizeInput<Input>
}

export const createMutationClient = <
  Validation extends ZodType,
  SecurityParams,
  Name extends string = string,
>(
  options: CreateMutationClientOptions<Validation, SecurityParams, Name>,
): MutationClient<Validation, SecurityParams, Name> => {
  // TODO Some runtime validation ?

  if (options.beneficiaryAnonymization) {
    addMutationLogToBeneficiaryAnonymization(
      options.name,
      options.beneficiaryAnonymization,
    )
  }
  return options
}
//
// type WithInputValidation<Validation extends ZodType = ZodType> = {
//   inputValidation: Validation
// }
// export type FeatureInput<Feature> = Feature extends WithInputValidation
//   ? z.infer<Feature['inputValidation']>
//   : undefined
//
// type WithServerData<ServerData = any> = {
//   getServerState: (...args: any[]) => Promise<ServerData>
// }
// export type FeatureServerData<Feature> = Feature extends WithServerData
//   ? Awaited<ReturnType<Feature['getServerState']>>
//   : undefined

type GetServerState<Input, ServerState> = (context: {
  input: Input
}) => Promise<ServerState>

type ExecuteMutation<ServerState, Input, MutationResult> = (context: {
  initialInput: Input
  input: Input
  serverState: ServerState
  transaction: Prisma.TransactionClient
}) => Promise<MutationResult>

interface CreateMutationServerOptions<
  ServerState,
  MutationResult,
  Validation extends ZodType,
  SecurityParams,
  Name extends string = string,
  Input = z.infer<Validation>,
> {
  client: MutationClient<Validation, SecurityParams, Name>
  getServerState?: GetServerState<Input, ServerState>
  executeMutation: ExecuteMutation<ServerState, Input, MutationResult>

  dataFromServerState: (
    serverState: ServerState,
    context: MutationContext<Input, ServerState>,
  ) => Input
  mutationLogInfo: (
    context: MutationContext<Input, ServerState>,
  ) => MutationLogInfo
}

interface MutationServer<
  ServerState,
  MutationResult,
  Validation extends ZodType,
  SecurityParams,
  Name extends string = string,
  Input = z.infer<Validation>,
> {
  // TODO execute() method and merged methods from client ?
  client: MutationClient<Validation, SecurityParams, Name>
  getServerState?: GetServerState<Input, ServerState>

  dataFromServerState?: (
    serverState: ServerState,
    context: MutationContext<Input, ServerState>,
  ) => Input

  executeMutation: ExecuteMutation<ServerState, Input, MutationResult>
  mutationLogInfo: (
    context: MutationContext<Input, ServerState>,
  ) => MutationLogInfo
}

export const createMutationServer = <
  ServerState,
  MutationResult,
  Validation extends ZodType,
  SecurityParams,
  Name extends string = string,
>(
  options: CreateMutationServerOptions<
    ServerState,
    MutationResult,
    Validation,
    SecurityParams,
    Name
  >,
): MutationServer<
  ServerState,
  MutationResult,
  Validation,
  SecurityParams,
  Name
> => {
  // TODO Some runtime validation ?
  // TODO merge stuff ?

  return options
}
