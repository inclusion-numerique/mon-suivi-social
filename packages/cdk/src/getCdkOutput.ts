import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { outputPrefix } from '@mss/cdk/output'

export type WebCdkOutput = {
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

export type ProjectCdkOutput = {
  databaseInstanceId: string
}

export type CdkOutput = {
  web: WebCdkOutput
  project: ProjectCdkOutput
}

// output_uploadsBucketName -> uploadsBucketName
export const normalizeCdkOutputKey = (key: string): string =>
  key.startsWith(outputPrefix) ? key.slice(outputPrefix.length) : key

export async function getCdkOutput(stack: 'web'): Promise<WebCdkOutput>
export async function getCdkOutput(stack: 'project'): Promise<ProjectCdkOutput>
export async function getCdkOutput(
  stack: 'web' | 'project',
): Promise<WebCdkOutput | ProjectCdkOutput> {
  const outputFile = resolve(
    // eslint-disable-next-line unicorn/prefer-module
    __dirname,
    '../cdk.out.json',
  )
  const outputContents = await readFile(outputFile, 'utf8')
  const rawOutput = JSON.parse(outputContents) as {
    [key in keyof CdkOutput]: Record<string, unknown>
  }

  const output = Object.fromEntries(
    Object.entries(rawOutput[stack]).map(([key, value]) => [
      normalizeCdkOutputKey(key),
      value,
    ]),
  )

  return output as WebCdkOutput
}
