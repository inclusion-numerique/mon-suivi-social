import {
  S3Backend,
  TerraformOutput,
  TerraformStack,
  TerraformVariable,
} from 'cdktf'
import { Construct } from 'constructs'
import { ScalewayProvider } from '../.gen/providers/scaleway/provider'
import { ObjectBucket } from '../.gen/providers/scaleway/object-bucket'
import { RdbDatabase } from '../.gen/providers/scaleway/rdb-database'
import { DataScalewayRdbInstance } from '../.gen/providers/scaleway/data-scaleway-rdb-instance'
import { RdbUser } from '../.gen/providers/scaleway/rdb-user'
import { RdbPrivilege } from '../.gen/providers/scaleway/rdb-privilege'
import { generateDatabasePassword } from './databasePassword'
import { DataScalewayContainerNamespace } from '../.gen/providers/scaleway/data-scaleway-container-namespace'
import { Container } from '../.gen/providers/scaleway/container'
import { CdkOutput } from './getCdkOutput'
import { DataScalewayDomainZone } from '../.gen/providers/scaleway/data-scaleway-domain-zone'
import {
  DomainRecord,
  DomainRecordConfig,
} from '../.gen/providers/scaleway/domain-record'
import { ContainerDomain } from '../.gen/providers/scaleway/container-domain'
import {
  computeBranchNamespace,
  generateDatabaseUrl,
  namespacer,
} from './utils'

const projectSlug = 'mss'
const databaseInstanceId = '7857e02a-05a5-437a-a46d-5da289559d67'
const containerNamespaceId = 'ec549573-e3c9-4688-8e85-d1cb247095e2'
const region = 'fr-par'
const domain = 'v2.monsuivisocial.incubateur.anct.gouv.fr'

export class WebAppStack extends TerraformStack {
  constructor(scope: Construct, id: string, branch: string) {
    super(scope, id)

    const namespace = computeBranchNamespace(branch)

    const namespaced = namespacer(namespace)

    const isMain = namespace === 'main'

    const subDomain = namespace
    const hostname = isMain ? domain : `${subDomain}.${domain}`

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
      })
    const envVariable = (name: string) =>
      new TerraformVariable(this, name, {
        type: 'string',
        sensitive: false,
      })

    // Configuring env variables
    const webContainerImage = envVariable('webContainerImage')
    // Configuring env secrets
    const accessKey = sensitiveEnvVariable('accessKey')
    const secretKey = sensitiveEnvVariable('secretKey')
    const organizationId = sensitiveEnvVariable('organizationId')
    const projectId = sensitiveEnvVariable('projectId')
    const databasePasswordSalt = sensitiveEnvVariable('databasePasswordSalt')

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
      bucket: 'mss-terraform',
      key: `${projectSlug}-${namespaced('state')}.tfstate`,
      // Credentials are provided with AWS_*** env variables
      endpoint: 'https://s3.fr-par.scw.cloud',
      skipCredentialsValidation: true,
      skipRegionValidation: true,
    })

    // The database instance is shared for each namespace/branch we refer to it (DataScaleway)
    // but do not manage it through this stack
    const dbInstance = new DataScalewayRdbInstance(this, 'dbInstance', {
      instanceId: databaseInstanceId,
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
      name: namespaced('mss-uploads'),
    })

    output('uploadsBucketName', uploadsBucket.name)
    output('uploadsBucketEndpoint', uploadsBucket.endpoint)

    const containerNamespace = new DataScalewayContainerNamespace(
      this,
      'containerNamespace',
      { namespaceId: containerNamespaceId },
    )

    const emailFromAddress = isMain
      ? `bot@${domain}`
      : `bot+${namespace}@${domain}`

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
    // The names failes with max length so we shorten it
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
        BASE_URL: hostname,
        BRANCH: branch,
        NAMESPACE: namespace,
      },
      secretEnvironmentVariables: {
        DATABASE_URL: databaseUrl,
      },
      name: containerName,
      minScale: isMain ? 2 : 0,
      maxScale: isMain ? 5 : 1,
      cpuLimit: 1120, //mVPCU
      memoryLimit: 2048, //mB
      deploy: true,
    })

    const rootZone = new DataScalewayDomainZone(this, 'dnsZone', {
      domain,
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
          name: namespace,
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
