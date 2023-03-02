import { S3Backend, TerraformStack } from 'cdktf'
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
  region,
} from '@mss/cdk/project'
import { generateDatabasePassword } from '@mss/cdk/databasePassword'
import { environmentVariable } from '@mss/cdk/environmentVariable'
import { createOutput } from '@mss/cdk/output'

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

    // Configuring env variables
    const webContainerImage = environmentVariable(this, 'WEB_CONTAINER_IMAGE', {
      sensitive: false,
    })
    const inclusionConnectPreviewIssuer = environmentVariable(
      this,
      'INCLUSION_CONNECT_PREVIEW_ISSUER',
      {
        sensitive: false,
      },
    )
    const inclusionConnectMainIssuer = environmentVariable(
      this,
      'INCLUSION_CONNECT_MAIN_ISSUER',
      {
        sensitive: false,
      },
    )
    const inclusionConnectPreviewClientId = environmentVariable(
      this,
      'INCLUSION_CONNECT_PREVIEW_CLIENT_ID',
      {
        sensitive: false,
      },
    )
    const inclusionConnectMainClientId = environmentVariable(
      this,
      'INCLUSION_CONNECT_MAIN_CLIENT_ID',
      {
        sensitive: false,
      },
    )

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
    const databasePasswordSalt = environmentVariable(
      this,
      'DATABASE_PASSWORD_SALT',
      {
        sensitive: true,
      },
    )
    const inclusionConnectPreviewClientSecret = environmentVariable(
      this,
      'INCLUSION_CONNECT_PREVIEW_CLIENT_SECRET',
      {
        sensitive: true,
      },
    )
    const inclusionConnectMainClientSecret = environmentVariable(
      this,
      'INCLUSION_CONNECT_MAIN_CLIENT_SECRET',
      {
        sensitive: true,
      },
    )

    // Configuring provider that will be used for the rest of the stack
    new ScalewayProvider(this, 'provider', {
      region,
      accessKey: accessKey.value,
      secretKey: secretKey.value,
      organizationId: organizationId.value,
      projectId: projectId.value,
    })

    // State of deployed infrastructure for each branch will be stored in the
    // same 'mss-terraform' bucket
    new S3Backend(this, {
      bucket: `${projectSlug}-web-tfstate`,
      key: `${projectSlug}-web-${namespaced('state')}.tfstate`,
      // Credentials are provided with AWS_*** env variables
      endpoint: 'https://s3.fr-par.scw.cloud',
      skipCredentialsValidation: true,
      skipRegionValidation: true,
    })

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
      password: generateDatabasePassword(
        databasePasswordSalt.value,
        namespaced(projectSlug),
      ),
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
      ? 'Mon Suivi Social'
      : `[${namespace}] Mon Suivi Social`

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
      registryImage: webContainerImage.value,
      environmentVariables: {
        EMAIL_FROM_ADDRESS: emailFromAddress,
        EMAIL_FROM_NAME: emailFromName,
        MSS_WEB_IMAGE: webContainerImage.value,
        UPLOADS_BUCKET_ID: uploadsBucket.id,
        BASE_URL: hostname,
        BRANCH: branch,
        NAMESPACE: namespace,
        SCW_DEFAULT_REGION: region,
        NEXT_PUBLIC_INCLUSION_CONNECT_ISSUER: isMain
          ? inclusionConnectMainIssuer.value
          : inclusionConnectPreviewIssuer.value,
        NEXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID: isMain
          ? inclusionConnectMainClientId.value
          : inclusionConnectPreviewClientId.value,
        NEXT_PUBLIC_SENTRY_ENVIRONMENT: namespace,
      },
      secretEnvironmentVariables: {
        DATABASE_URL: databaseUrl,
        INCLUSION_CONNECT_CLIENT_SECRET: isMain
          ? inclusionConnectMainClientSecret.value
          : inclusionConnectPreviewClientSecret.value,
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
    output('webContainerImage', webContainerImage.value)
  }
}
