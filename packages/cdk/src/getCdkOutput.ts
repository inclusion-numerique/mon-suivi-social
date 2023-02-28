import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export type CdkOutput = {
  webBaseUrl: string
  containerDomainName: string
  databaseName: string
  databaseUrl: string
  databasePassword: string
  databaseUser: string
  databaseHost: string
  databasePort: number
  uploadsBucketEndpoint: string
  uploadsBucketName: string
  webContainerId: string
  webContainerImage: string
  webContainerStatus: 'ready' | 'error'
}

// Outputs are prefixed by web_output and suffixed by _{hash}
// Sometimes (in CI, I don't know why, maybe depending on terraform version), they are just prefixed with output_
// web_outputuploadsBucketName_14BB6D15 -> uploadsBucketName
// output_uploadsBucketName -> uploadsBucketName
export const normalizeCdkOutputKey = (key: string): string => {
  const withoutPrefix = key.startsWith('web_output')
    ? key.slice('web_output'.length)
    : key.slice('output_'.length)

  const parts = withoutPrefix.split('_')
  if (parts.length > 1) {
    parts.pop()
  }

  return parts.join('_')
}

export const getCdkOutput = async (): Promise<CdkOutput> => {
  const outputFile = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../cdk.out.json',
  )
  const outputContents = await readFile(outputFile, 'utf8')
  const rawOutput = JSON.parse(outputContents) as {
    web: Record<string, unknown>
  }

  const output = Object.fromEntries(
    Object.entries(rawOutput.web).map(([key, value]) => [
      normalizeCdkOutputKey(key),
      value,
    ]),
  )

  return output as CdkOutput
}
