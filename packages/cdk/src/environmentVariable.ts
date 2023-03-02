import { TerraformVariable } from 'cdktf'
import { Construct } from 'constructs'

// See https://developer.hashicorp.com/terraform/cdktf/create-and-deploy/best-practices
export const environmentVariable = (
  scope: Construct,
  name: string,
  {
    sensitive,
  }: {
    sensitive: boolean
  },
) => {
  const variable = new TerraformVariable(scope, name, {
    type: 'string',
    sensitive,
  }) as Omit<TerraformVariable, 'value'> & { value: string }

  // We override the logical id so we can inject variable by providing env variable TF_VAR_{name}
  // Else the environment name will be something like TF_VAR_{stackName}_{snakeCaseName}_{randomId}
  // And it is hard to know and to maintain
  variable.overrideLogicalId(name)

  return variable
}
