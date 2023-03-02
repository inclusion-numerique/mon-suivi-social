import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { ProjectCdkOutput } from '@mss/cdk/getCdkOutput'
import { environmentVariable } from '@mss/cdk/environmentVariable'
import { createOutput } from '@mss/cdk/output'

/**
 * This stack represents the resources shared by other project stacks
 * It aims to be deployed only once, and used by other stacks
 */
export class ProjectStack extends TerraformStack {
  constructor(scope: Construct) {
    super(scope, 'project')

    // ⚠️ When calling this function, do not forget to update typings in src/getCdkOutput.ts
    const output = createOutput<ProjectCdkOutput>(this)

    const testEnvironmentVariable = environmentVariable(this, 'TEST_ENV_VAR', {
      sensitive: false,
    })
    const sensitiveTestEnvironmentVariable = environmentVariable(
      this,
      'TEST_SENSITIVE_ENV_VAR',
      {
        sensitive: true,
      },
    )

    output('databaseInstanceId', 'huit')
  }
}
