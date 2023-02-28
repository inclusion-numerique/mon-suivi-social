import { readFile } from 'fs/promises'
import { resolve } from 'path'

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
  let withoutPrefix: string
  if (key.startsWith('web_output')) {
    withoutPrefix = key.substring('web_output'.length)
  } else {
    withoutPrefix = key.substring('output_'.length)
  }

  const parts = withoutPrefix.split('_')
  if (parts.length > 1) {
    parts.pop()
  }

  return parts.join('_')
}

export const getCdkOutput = async (): Promise<CdkOutput> => {
  const outputFile = resolve(__dirname, '../cdk.out.json')
  const outputContents = await readFile(outputFile, 'utf-8')
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
