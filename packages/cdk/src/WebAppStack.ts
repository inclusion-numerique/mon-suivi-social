import { S3Backend, TerraformOutput, TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { ScalewayProvider } from '@mss/scaleway/provider'
import { RdbDatabase } from '@mss/scaleway/rdb-database'
import { DataScalewayRdbInstance } from '@mss/scaleway/data-scaleway-rdb-instance'
import { RdbUser } from '@mss/scaleway/rdb-user'
import { RdbPrivilege } from '@mss/scaleway/rdb-privilege'
import { DataScalewayContainerNamespace } from '@mss/scaleway/data-scaleway-container-namespace'
import { Container } from '@mss/scaleway/container'
import { CdkOutput } from '@mss/cdk/getCdkOutput'
import { DataScalewayDomainZone } from '@mss/scaleway/data-scaleway-domain-zone'
import { DomainRecord, DomainRecordConfig } from '@mss/scaleway/domain-record'
import { ContainerDomain } from '@mss/scaleway/container-domain'
import {
  computeBranchNamespace,
  createPreviewSubdomain,
  environmentVariable,
  generateDatabaseUrl,
  namespacer,
  sensitiveEnvironmentVariable,
} from '@mss/cdk/utils'
import { ObjectBucket } from '@mss/scaleway/object-bucket'
import { generateDatabasePassword } from './databasePassword'

const projectSlug = 'mss'
const databaseInstanceName = 'incnum-prod'
const containerNamespaceName = 'mss-web'
const region = 'fr-par'
const mainDomain = 'v2.monsuivisocial.incubateur.anct.gouv.fr'
const previewDomain = 'v2.monsuivisocial.incubateur.anct.gouv.fr'

export class WebAppStack extends TerraformStack {
  constructor(scope: Construct, id: string, branch: string) {
    super(scope, id)

    const namespace = computeBranchNamespace(branch)

    const namespaced = namespacer(namespace)

    const isMain = namespace === 'main'

    const { hostname, subdomain } = isMain
      ? { hostname: mainDomain, subdomain: '' }
      : createPreviewSubdomain(namespace, previewDomain)

    // Output helper function
    // ⚠️ When calling this function, do not forget to update typings in src/getCdkOutput.ts
    const output = <T extends keyof CdkOutput>(
      name: T,
      value: CdkOutput[T],
      sensitive?: 'sensitive',
    ) =>
      new TerraformOutput(this, `output_${name}`, {
        value,
        sensitive: sensitive === 'sensitive',
      })

    // Configuring env variables
    const webContainerImage = environmentVariable(this, 'webContainerImage')
    const previewInclusionConnectIssuer = environmentVariable(
      this,
      'previewInclusionConnectIssuer',
    )
    const mainInclusionConnectIssuer = environmentVariable(
      this,
      'mainInclusionConnectIssuer',
    )
    const previewInclusionConnectClientId = environmentVariable(
      this,
      'previewInclusionConnectClientId',
    )
    const mainInclusionConnectClientId = environmentVariable(
      this,
      'mainInclusionConnectClientId',
    )

    // Configuring env secrets
    const accessKey = sensitiveEnvironmentVariable(this, 'accessKey')
    const secretKey = sensitiveEnvironmentVariable(this, 'secretKey')
    const organizationId = sensitiveEnvironmentVariable(this, 'organizationId')
    const projectId = sensitiveEnvironmentVariable(this, 'projectId')
    const databasePasswordSalt = sensitiveEnvironmentVariable(
      this,
      'databasePasswordSalt',
    )
    const previewInclusionConnectClientSecret = environmentVariable(
      this,
      'previewInclusionConnectClientSecret',
    )
    const mainInclusionConnectClientSecret = environmentVariable(
      this,
      'mainInclusionConnectClientSecret',
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
          ? mainInclusionConnectIssuer.value
          : previewInclusionConnectIssuer.value,
        NEXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID: isMain
          ? mainInclusionConnectClientId.value
          : previewInclusionConnectClientId.value,
        NEXT_PUBLIC_SENTRY_ENVIRONMENT: namespace,
      },
      secretEnvironmentVariables: {
        DATABASE_URL: databaseUrl,
        INCLUSION_CONNECT_CLIENT_SECRET: isMain
          ? mainInclusionConnectClientSecret.value
          : previewInclusionConnectClientSecret.value,
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
      container.status as CdkOutput['webContainerStatus'],
    )
    output('webContainerId', container.id)
    output('webContainerImage', webContainerImage.value)
  }
}
