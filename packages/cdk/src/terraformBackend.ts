import { S3Backend } from 'cdktf'
import { projectSlug } from '@mss/config/config'
import { Construct } from 'constructs'

export const terraformBackend = (scope: Construct, stack: string) =>
  new S3Backend(scope, {
    bucket: `${projectSlug}-terraform-state`,
    key: `${projectSlug}-${stack}.tfstate`,
    // Credentials are provided with AWS_*** env variables
    endpoint: 'https://s3.fr-par.scw.cloud',
    skipCredentialsValidation: true,
    skipRegionValidation: true,
  })
