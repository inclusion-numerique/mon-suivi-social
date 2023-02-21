import { MutationClient } from '@mss/web/features/createMutation.client'
import { ZodType } from 'zod'
import { SecurityRuleGrantee } from '@mss/web/security/rules'

const mutations = new Map<string, MutationClient<any, any, any>>()

export const registerMutation = <
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
>(
  client: MutationClient<Validation, Name, Grantee, Target, SecurityParams>,
) => {
  if (mutations.has(client.name)) {
    throw new Error(
      `Feature ${client.name} already have been declared. Please check that you have distinct feature names`,
    )
  }

  mutations.set(client.name, client)
}

export const getMutationClient = (
  featureName: string,
): MutationClient<any> | undefined => mutations.get(featureName)
