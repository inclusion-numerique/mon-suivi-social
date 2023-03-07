import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { ProjectCdkOutput, WebCdkOutput } from '@mss/cdk/getCdkOutput'
import { environmentVariable } from '@mss/cdk/environmentVariable'
import { createOutput } from '@mss/cdk/output'
import { databaseInstanceName, region } from '@mss/cdk/project'
import { ScalewayProvider } from '@mss/scaleway/provider'
import { RdbInstance } from '@mss/scaleway/rdb-instance'

/**
 * This stack represents the resources shared by other project stacks
 * It aims to be deployed only once, and used by other stacks
 */
export class ProjectStack extends TerraformStack {
  constructor(scope: Construct) {
    super(scope, 'project')

    // ⚠️ When calling this function, do not forget to update typings in src/getCdkOutput.ts
    const output = createOutput<ProjectCdkOutput>(this)

    // Configuring env secrets
    const accessKey = environmentVariable(this, 'SCW_ACCESS_KEY', {
      sensitive: true,
    })
    const secretKey = environmentVariable(this, 'SCW_SECRET_KEY', {
      sensitive: true,
    })
    const organizationId = environmentVariable(
      this,
      'SCW_DEFAULT_ORGANIZATION_ID',
      {
        sensitive: true,
      },
    )
    const projectId = environmentVariable(this, 'SCW_PROJECT_ID', {
      sensitive: true,
    })

    // Configuring provider that will be used for the rest of the stack
    new ScalewayProvider(this, 'provider', {
      region,
      accessKey: accessKey.value,
      secretKey: secretKey.value,
      organizationId: organizationId.value,
      projectId: projectId.value,
    })

    const database = new RdbInstance(this, 'database', {
      name: databaseInstanceName,
      engine: 'PostgreSQL-14',
      disableBackup: false,
      backupScheduleFrequency: 24,
      backupScheduleRetention: 14,
    })

    output('databaseInstanceId', database.id)
    output('databaseEndpointIp', database.endpointIp)
    output('databaseEndpointPort', database.endpointPort)
  }
}
