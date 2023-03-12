import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { ProjectCdkOutput } from '@mss/cdk/getCdkOutput'
import { environmentVariablesFromList } from '@mss/cdk/environmentVariable'
import { createOutput } from '@mss/cdk/output'
import { ScalewayProvider } from '@mss/scaleway/provider'
import { RdbInstance } from '@mss/scaleway/rdb-instance'
import { DomainZone } from '@mss/scaleway/domain-zone'
import { ContainerNamespace } from '@mss/scaleway/container-namespace'
import { TemDomain } from '@mss/scaleway/tem-domain'
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
import { DomainRecord } from '@mss/scaleway/domain-record'
import { terraformBackend } from '@mss/cdk/terraformBackend'
import { ObjectBucket } from '@mss/scaleway/object-bucket'
import { RegistryNamespace } from '@mss/scaleway/registry-namespace'
import { Cockpit } from '@mss/scaleway/cockpit'

export const projectStackVariables = [
  'SCW_DEFAULT_ORGANIZATION_ID',
  'SCW_PROJECT_ID',
  'EMAIL_FROM_DOMAIN',
  'UPLOADS_BUCKET_ID',
  'WEB_APP_DOCKER_REGISTRY_NAME',
] as const

export const projectStackSensitiveVariables = [
  'NEXTAUTH_SECRET',
  'SCW_ACCESS_KEY',
  'SCW_SECRET_KEY',
  'SENTRY_AUTH_TOKEN',
  'SMTP_PASSWORD',
  'SMTP_SERVER',
  'SMTP_USERNAME',
] as const

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
      projectStackVariables,
      { sensitive: false },
    )

    const sensitiveEnvironmentVariables = environmentVariablesFromList(
      this,
      projectStackSensitiveVariables,
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

    terraformBackend(this, 'project')

    const mainDomainZone = new DomainZone(this, 'mainDomainZone', {
      domain: mainDomain,
      subdomain: '',
    })

    // If preview domain or email from domain differ, create different zones for those
    // const previewDomainZone = mainDomainZone
    const emailDomainZone = mainDomainZone

    const transactionalEmailDomain = new TemDomain(
      this,
      'transactionalEmailDomain',
      {
        name: environmentVariables.EMAIL_FROM_DOMAIN.value,
      },
    )

    // Uploads bucket for usage in integration testing and dev environments
    new ObjectBucket(this, 'devUploads', {
      name: environmentVariables.UPLOADS_BUCKET_ID.value,
      corsRule: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
          maxAgeSeconds: 3000,
          exposeHeaders: ['Etag'],
          allowedOrigins: ['http://localhost:3000', 'http://localhost'],
        },
      ],
    })

    // https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/rdb_instance
    const database = new RdbInstance(this, 'database', {
      name: databaseInstanceName,
      engine: 'PostgreSQL-14',
      isHaCluster: true,
      nodeType: 'db-dev-m',
      disableBackup: false,
      backupSameRegion: false,
      backupScheduleFrequency: 24,
      backupScheduleRetention: 14,
      volumeType: 'bssd', // Block storage
      volumeSizeInGb: 15,
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

    new RegistryNamespace(this, 'webApp', {
      name: environmentVariables.WEB_APP_DOCKER_REGISTRY_NAME.value,
      description: 'Built Web App docker images, ready to use in containers',
    })

    const cockpit = new Cockpit(this, 'cockpit', {})

    // Main domain DNS Records
    new DomainRecord(this, 'ns0', {
      dnsZone: mainDomainZone.domain,
      type: 'NS',
      name: '',
      data: 'ns0.dom.scw.cloud.',
      ttl: 600,
    })
    new DomainRecord(this, 'ns1', {
      dnsZone: mainDomainZone.domain,
      type: 'NS',
      name: '',
      data: 'ns1.dom.scw.cloud.',
      ttl: 600,
    })

    // Email domain DNS Records
    new DomainRecord(this, 'spf', {
      dnsZone: emailDomainZone.domain,
      type: 'TXT',
      name: '',
      data: `v=spf1 ${transactionalEmailDomain.spfConfig} -all`,
      ttl: 3600,
    })
    // MX is recommended for improved deverability
    new DomainRecord(this, 'mx', {
      dnsZone: emailDomainZone.domain,
      type: 'MX',
      name: '',
      data: '1 incubateur.anct.gouv.fr.',
      ttl: 3600,
    })
    new DomainRecord(this, 'dkim', {
      dnsZone: emailDomainZone.domain,
      type: 'TXT',
      name: `${transactionalEmailDomain.projectId}._domainkey`,
      data: transactionalEmailDomain.dkimConfig,
      ttl: 3600,
    })

    output('cockpitId', cockpit.id)
    output('mainDomainZoneId', mainDomainZone.id)
    output('transactionalEmailDomainStatus', transactionalEmailDomain.status)
    output('webContainersId', webContainers.id)
    output('databaseInstanceId', database.id)
    output('databaseEndpointIp', database.endpointIp)
    output('databaseEndpointPort', database.endpointPort)
  }
}
