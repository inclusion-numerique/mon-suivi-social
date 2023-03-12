import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { ScalewayProvider } from '@mss/scaleway/provider'
import { RdbDatabase } from '@mss/scaleway/rdb-database'
import { DataScalewayRdbInstance } from '@mss/scaleway/data-scaleway-rdb-instance'
import { RdbUser } from '@mss/scaleway/rdb-user'
import { RdbPrivilege } from '@mss/scaleway/rdb-privilege'
import { DataScalewayContainerNamespace } from '@mss/scaleway/data-scaleway-container-namespace'
import { Container } from '@mss/scaleway/container'
import { WebCdkOutput } from '@mss/cdk/getCdkOutput'
import { DataScalewayDomainZone } from '@mss/scaleway/data-scaleway-domain-zone'
import { DomainRecord, DomainRecordConfig } from '@mss/scaleway/domain-record'
import { ContainerDomain } from '@mss/scaleway/container-domain'
import {
  computeBranchNamespace,
  createPreviewSubdomain,
  generateDatabaseUrl,
  namespacer,
} from '@mss/cdk/utils'
import { ObjectBucket } from '@mss/scaleway/object-bucket'
import {
  containerNamespaceName,
  databaseInstanceName,
  mainDomain,
  previewDomain,
  projectSlug,
  projectTitle,
  region,
} from '@mss/config/config'
import { environmentVariablesFromList } from '@mss/cdk/environmentVariable'
import { createOutput } from '@mss/cdk/output'
import { terraformBackend } from '@mss/cdk/terraformBackend'

export const webAppStackVariables = [
  'WEB_CONTAINER_IMAGE',
  'INCLUSION_CONNECT_PREVIEW_ISSUER',
  'INCLUSION_CONNECT_MAIN_ISSUER',
  'INCLUSION_CONNECT_PREVIEW_CLIENT_ID',
  'INCLUSION_CONNECT_MAIN_CLIENT_ID',
  'SCW_DEFAULT_ORGANIZATION_ID',
  'SCW_PROJECT_ID',
] as const
export const webAppStackSensitiveVariables = [
  'SCW_ACCESS_KEY',
  'SCW_SECRET_KEY',
  'DATABASE_PASSWORD',
  'INCLUSION_CONNECT_PREVIEW_CLIENT_SECRET',
  'INCLUSION_CONNECT_MAIN_CLIENT_SECRET',
] as const

/**
 * This stack represents the web app for a given branch (namespace).
 * It can be deployed for each branch.
 */
export class WebAppStack extends TerraformStack {
  constructor(scope: Construct, branch: string) {
    super(scope, 'web')

    const namespace = computeBranchNamespace(branch)

    const namespaced = namespacer(namespace)

    // ⚠️ When calling this function, do not forget to update typings in src/getCdkOutput.ts
    const output = createOutput<WebCdkOutput>(this)

    const isMain = namespace === 'main'

    const { hostname, subdomain } = isMain
      ? { hostname: mainDomain, subdomain: '' }
      : createPreviewSubdomain(namespace, previewDomain)

    const environmentVariables = environmentVariablesFromList(
      this,
      webAppStackVariables,
      { sensitive: false },
    )
    const sensitiveEnvironmentVariables = environmentVariablesFromList(
      this,
      webAppStackSensitiveVariables,
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

    // State of deployed infrastructure for each branch will be stored in the
    // same 'mss-terraform-state' bucket, with namespace in .tfstate filename.
    terraformBackend(this, `web-${namespace}`)

    // The database instance is shared for each namespace/branch we refer to it (DataScaleway)
    // but do not manage it through this stack
    const databaseInstance = new DataScalewayRdbInstance(this, 'dbInstance', {
      name: databaseInstanceName,
    })

    output('databaseHost', databaseInstance.endpointIp)
    output('databasePort', databaseInstance.endpointPort)

    const databaseConfig = {
      name: namespaced(projectSlug),
      user: namespaced(projectSlug),
      password: sensitiveEnvironmentVariables.DATABASE_PASSWORD.value,
    }

    const databaseUser = new RdbUser(this, 'databaseUser', {
      name: databaseConfig.name,
      instanceId: databaseInstance.instanceId,
      password: databaseConfig.password,
    })

    const database = new RdbDatabase(this, 'database', {
      name: databaseConfig.name,
      instanceId: databaseInstance.instanceId,
    })

    output('databaseUser', databaseConfig.user)
    output('databaseName', databaseConfig.name)

    new RdbPrivilege(this, 'databasePrivilege', {
      instanceId: databaseInstance.instanceId,
      databaseName: databaseConfig.name,
      userName: databaseConfig.user,
      permission: 'all',
      dependsOn: [database, databaseUser],
    })

    const uploadsBucket = new ObjectBucket(this, 'uploads', {
      name: namespaced(`${projectSlug}-uploads`),
      corsRule: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
          maxAgeSeconds: 3000,
          exposeHeaders: ['Etag'],
          allowedOrigins: [`https://${hostname}`],
        },
      ],
    })

    output('uploadsBucketName', uploadsBucket.name)
    output('uploadsBucketEndpoint', uploadsBucket.endpoint)

    const containerNamespace = new DataScalewayContainerNamespace(
      this,
      'containerNamespace',
      { name: containerNamespaceName },
    )

    const emailFromAddress = isMain
      ? `bot@${mainDomain}`
      : `bot+${namespace}@${mainDomain}`

    const emailFromName = isMain
      ? projectTitle
      : `[${namespace}] ${projectTitle}`

    const databaseUrl = generateDatabaseUrl({
      user: databaseConfig.user,
      password: databaseConfig.password,
      host: databaseInstance.endpointIp,
      port: databaseInstance.endpointPort,
      name: databaseConfig.name,
    })

    // Changing the name will recreate a new container
    // The names fails with max length so we shorten it
    const maxContainerNameLength = 34
    const containerName =
      namespace.length > maxContainerNameLength
        ? namespace.slice(0, Math.max(0, maxContainerNameLength))
        : namespace

    const container = new Container(this, 'webContainer', {
      namespaceId: containerNamespace.namespaceId,
      registryImage: environmentVariables.WEB_CONTAINER_IMAGE.value,
      environmentVariables: {
        EMAIL_FROM_ADDRESS: emailFromAddress,
        EMAIL_FROM_NAME: emailFromName,
        MSS_WEB_IMAGE: environmentVariables.WEB_CONTAINER_IMAGE.value,
        UPLOADS_BUCKET_ID: uploadsBucket.id,
        BASE_URL: hostname,
        BRANCH: branch,
        NAMESPACE: namespace,
        SCW_DEFAULT_REGION: region,
        NEXT_PUBLIC_INCLUSION_CONNECT_ISSUER: isMain
          ? environmentVariables.INCLUSION_CONNECT_MAIN_ISSUER.value
          : environmentVariables.INCLUSION_CONNECT_PREVIEW_ISSUER.value,
        NEXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID: isMain
          ? environmentVariables.INCLUSION_CONNECT_MAIN_CLIENT_ID.value
          : environmentVariables.INCLUSION_CONNECT_PREVIEW_CLIENT_ID.value,
        NEXT_PUBLIC_SENTRY_ENVIRONMENT: namespace,
      },
      secretEnvironmentVariables: {
        DATABASE_URL: databaseUrl,
        INCLUSION_CONNECT_CLIENT_SECRET: isMain
          ? sensitiveEnvironmentVariables.INCLUSION_CONNECT_MAIN_CLIENT_SECRET
              .value
          : sensitiveEnvironmentVariables
              .INCLUSION_CONNECT_PREVIEW_CLIENT_SECRET.value,
      },
      name: containerName,
      minScale: isMain ? 2 : 0,
      maxScale: isMain ? 5 : 1,
      cpuLimit: 1120, // mVPCU
      memoryLimit: 2048, // mB
      deploy: true,
    })

    const rootZone = new DataScalewayDomainZone(this, 'dnsZone', {
      domain: isMain ? mainDomain : previewDomain,
    })

    const webDnsRecordConfig: DomainRecordConfig = isMain
      ? // Main app is hosted on root domain name
        {
          type: 'ALIAS',
          dnsZone: rootZone.domain,
          name: '',
          data: `${container.domainName}.`,
          ttl: 60 * 5,
        }
      : // Preview apps are hosted on preview subdomains
        {
          type: 'CNAME',
          dnsZone: rootZone.domain,
          name: subdomain,
          data: `${container.domainName}.`,
          ttl: 60 * 5,
        }

    const webDnsRecord = new DomainRecord(
      this,
      'webDnsRecord',
      webDnsRecordConfig,
    )

    new ContainerDomain(this, 'webContainerDomain', {
      containerId: container.id,
      hostname,
      dependsOn: [webDnsRecord, container],
    })

    output('webBaseUrl', hostname)
    output('containerDomainName', container.domainName)
    output('databaseUrl', databaseUrl, 'sensitive')
    output('databasePassword', databaseConfig.password, 'sensitive')
    output(
      'webContainerStatus',
      container.status as WebCdkOutput['webContainerStatus'],
    )
    output('webContainerId', container.id)
    output('webContainerImage', environmentVariables.WEB_CONTAINER_IMAGE.value)
  }
}
