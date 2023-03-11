import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { ProjectCdkOutput } from '@mss/cdk/getCdkOutput'
import { environmentVariablesFromList } from '@mss/cdk/environmentVariable'
import { createOutput } from '@mss/cdk/output'
import { ScalewayProvider } from '@mss/scaleway/provider'
import { RdbInstance } from '@mss/scaleway/rdb-instance'
import { DomainZone } from '@mss/scaleway/domain-zone'
import { ContainerNamespace } from '@mss/scaleway/container-namespace'
import {
  chromaticAppId,
  containerNamespaceName,
  databaseInstanceName,
  mainDomain,
  nextTelemetryDisabled,
  publicContactEmail,
  publicSentryDsn,
  region,
  sentryOrg,
  sentryProject,
  sentryUrl,
  smtpPort,
} from '@mss/config/config'

/**
 * This stack represents the resources shared by other project stacks
 * It aims to be deployed only once, and used by other stacks
 */
export class ProjectStack extends TerraformStack {
  constructor(scope: Construct) {
    super(scope, 'project')

    // ⚠️ When calling this function, do not forget to update typings in src/getCdkOutput.ts
    const output = createOutput<ProjectCdkOutput>(this)

    const environmentVariables = environmentVariablesFromList(
      this,
      ['SCW_DEFAULT_ORGANIZATION_ID', 'SCW_PROJECT_ID'],
      { sensitive: false },
    )

    const sensitiveEnvironmentVariables = environmentVariablesFromList(
      this,
      [
        'NEXTAUTH_SECRET',
        'SCW_ACCESS_KEY',
        'SCW_SECRET_KEY',
        'SENTRY_AUTH_TOKEN',
        'SMTP_PASSWORD',
        'SMTP_SERVER',
        'SMTP_USERNAME',
      ],
      { sensitive: true },
    )

    // Configuring provider that will be used for the rest of the stack
    new ScalewayProvider(this, 'provider', {
      region,
      accessKey: sensitiveEnvironmentVariables.SCW_ACCESS_KEY.value,
      secretKey: sensitiveEnvironmentVariables.SCW_SECRET_KEY.value,
      organizationId: environmentVariables.SCW_DEFAULT_ORGANIZATION_ID.value,
      projectId: environmentVariables.SCW_PROJECT_ID.value,
    })

    const mainDomainZone = new DomainZone(this, 'mainDomainZone', {
      domain: mainDomain,
      subdomain: '',
    })
    // For now preview and main are in the same domain zone.
    // const previewDomainZone = domainZone

    const database = new RdbInstance(this, 'database', {
      name: databaseInstanceName,
      engine: 'PostgreSQL-14',
      isHaCluster: true,
      nodeType: 'db-dev-m',
      disableBackup: false,
      backupSameRegion: false,
      backupScheduleFrequency: 24,
      backupScheduleRetention: 14,
    })

    const webContainers = new ContainerNamespace(this, 'webContainers', {
      name: containerNamespaceName,
      description: 'Web application containers',
      environmentVariables: {
        CHROMATIC_APP_ID: chromaticAppId,
        NEXT_PUBLIC_CONTACT_EMAIL: publicContactEmail,
        NEXT_PUBLIC_SENTRY_DSN: publicSentryDsn,
        NEXT_TELEMETRY_DISABLED: nextTelemetryDisabled,
        SENTRY_ORG: sentryOrg,
        SENTRY_PROJECT: sentryProject,
        SENTRY_URL: sentryUrl,
        SMTP_PORT: smtpPort,
      },
      secretEnvironmentVariables: {
        NEXTAUTH_SECRET: sensitiveEnvironmentVariables.NEXTAUTH_SECRET.value,
        SCW_ACCESS_KEY: sensitiveEnvironmentVariables.SCW_ACCESS_KEY.value,
        SCW_SECRET_KEY: sensitiveEnvironmentVariables.SCW_SECRET_KEY.value,
        SENTRY_AUTH_TOKEN:
          sensitiveEnvironmentVariables.SENTRY_AUTH_TOKEN.value,
        SMTP_PASSWORD: sensitiveEnvironmentVariables.SMTP_PASSWORD.value,
        SMTP_SERVER: sensitiveEnvironmentVariables.SMTP_SERVER.value,
        SMTP_USERNAME: sensitiveEnvironmentVariables.SMTP_USERNAME.value,
      },
    })

    output('mainDomainZoneId', mainDomainZone.id)
    output('webContainersId', webContainers.id)
    output('databaseInstanceId', database.id)
    output('databaseEndpointIp', database.endpointIp)
    output('databaseEndpointPort', database.endpointPort)
  }
}
