import { TerraformVariable } from 'cdktf'
import { Construct } from 'constructs'

type EnvironmentVariable = Omit<TerraformVariable, 'value'> & { value: string }

// See https://developer.hashicorp.com/terraform/cdktf/create-and-deploy/best-practices
export const environmentVariable = (
  scope: Construct,
  name: string,
  {
    sensitive,
  }: {
    sensitive: boolean
  },
): EnvironmentVariable => {
  const variable = new TerraformVariable(scope, name, {
    type: 'string',
    sensitive,
  }) as EnvironmentVariable

  // We override the logical id so we can inject variable by providing env variable TF_VAR_{name}
  // Else the environment name will be something like TF_VAR_{stackName}_{snakeCaseName}_{randomId}
  // And it is hard to know and to maintain
  variable.overrideLogicalId(name)

  return variable
}

export const environmentVariablesFromList = <T extends string>(
  scope: Construct,
  variableNames: T[],
  { sensitive }: { sensitive: boolean },
): { [key in T]: EnvironmentVariable } => {
  const result = {} as { [key in T]: EnvironmentVariable }

  for (const variableName of variableNames) {
    result[variableName] = environmentVariable(scope, variableName, {
      sensitive,
    })
  }

  return result as { [key in T]: EnvironmentVariable }
}
