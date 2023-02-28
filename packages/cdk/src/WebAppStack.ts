import {
  S3Backend,
  TerraformOutput,
  TerraformStack,
  TerraformVariable,
} from 'cdktf'
import { Construct } from 'constructs'
import { ScalewayProvider } from '@mss/scaleway/provider'
import { RdbDatabase } from '@mss/scaleway/rdb-database'
import { DataScalewayRdbInstance } from '@mss/scaleway/data-scaleway-rdb-instance'
import { RdbUser } from '@mss/scaleway/rdb-user'
import { RdbPrivilege } from '@mss/scaleway/rdb-privilege'
import { generateDatabasePassword } from './databasePassword'
import { DataScalewayContainerNamespace } from '@mss/scaleway/data-scaleway-container-namespace'
import { Container } from '@mss/scaleway/container'
import { CdkOutput } from '@mss/cdk/getCdkOutput'
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

    // See https://developer.hashicorp.com/terraform/cdktf/create-and-deploy/best-practices
    const sensitiveEnvVariable = (name: string) =>
      new TerraformVariable(this, name, {
        type: 'string',
        sensitive: true,
      }) as Omit<TerraformVariable, 'value'> & { value: string }
    const envVariable = (name: string) =>
      new TerraformVariable(this, name, {
        type: 'string',
        sensitive: false,
      }) as Omit<TerraformVariable, 'value'> & { value: string }

    // Configuring env variables
    const webContainerImage = envVariable('webContainerImage')
    const previewInclusionConnectIssuer = envVariable(
      'previewInclusionConnectIssuer',
    )
    const mainInclusionConnectIssuer = envVariable('mainInclusionConnectIssuer')
    const previewInclusionConnectClientId = envVariable(
      'previewInclusionConnectClientId',
    )
    const mainInclusionConnectClientId = envVariable(
      'mainInclusionConnectClientId',
    )

    // Configuring env secrets
    const accessKey = sensitiveEnvVariable('accessKey')
    const secretKey = sensitiveEnvVariable('secretKey')
    const organizationId = sensitiveEnvVariable('organizationId')
    const projectId = sensitiveEnvVariable('projectId')
    const databasePasswordSalt = sensitiveEnvVariable('databasePasswordSalt')
    const previewInclusionConnectClientSecret = envVariable(
      'previewInclusionConnectClientSecret',
    )
    const mainInclusionConnectClientSecret = envVariable(
      'mainInclusionConnectClientSecret',
    )

    // Configuring provider that will be used for the rest of the stack
    new ScalewayProvider(this, 'provider', {
      region: region,
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
    const dbInstance = new DataScalewayRdbInstance(this, 'dbInstance', {
      name: databaseInstanceName,
    })

    output('databaseHost', dbInstance.endpointIp)
    output('databasePort', dbInstance.endpointPort)

    const dbConfig = {
      name: namespaced(projectSlug),
      user: namespaced(projectSlug),
      password: generateDatabasePassword(
        databasePasswordSalt.value,
        namespaced(projectSlug),
      ),
    }

    const databaseUser = new RdbUser(this, 'databaseUser', {
      name: dbConfig.name,
      instanceId: dbInstance.instanceId,
      password: dbConfig.password,
    })

    const database = new RdbDatabase(this, 'database', {
      name: dbConfig.name,
      instanceId: dbInstance.instanceId,
    })

    output('databaseUser', dbConfig.user)
    output('databaseName', dbConfig.name)

    new RdbPrivilege(this, 'databasePrivilege', {
      instanceId: dbInstance.instanceId,
      databaseName: dbConfig.name,
      userName: dbConfig.user,
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
      user: dbConfig.user,
      password: dbConfig.password,
      host: dbInstance.endpointIp,
      port: dbInstance.endpointPort,
      name: dbConfig.name,
    })

    // Changing the name will recreate a new container
    // The names fails with max length so we shorten it
    const maxContainerNameLength = 34
    const containerName =
      namespace.length > maxContainerNameLength
        ? namespace.substring(0, maxContainerNameLength)
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
      cpuLimit: 1120, //mVPCU
      memoryLimit: 2048, //mB
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
    output('databasePassword', dbConfig.password, 'sensitive')
    output(
      'webContainerStatus',
      container.status as CdkOutput['webContainerStatus'],
    )
    output('webContainerId', container.id)
    output('webContainerImage', webContainerImage.value)
  }
}
