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

export const getCdkOutput = async (): Promise<CdkOutput> => {
  const outputFile = resolve(__dirname, '../cdk.out.json')
  const outputContents = await readFile(outputFile, 'utf-8')
  // Outputs are prefixed by output_
  const rawOutput = JSON.parse(outputContents)
  // output_blah -> blah
  const output = Object.fromEntries(
    Object.entries(rawOutput['web']).map(([key, value]) => [
      key.substring(7),
      value,
    ]),
  )

  return output as CdkOutput
}
