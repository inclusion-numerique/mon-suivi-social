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
  const rawOutput = JSON.parse(outputContents)

  // Outputs are prefixed by web_output and suffixed by _{hash}
  // web_outputuploadsBucketName_14BB6D15 -> uploadsBucketName

  const output = Object.fromEntries(
    Object.entries(rawOutput['web']).map(([key, value]) => {
      const parts = key.split('_')
      parts.pop()

      const prefixedVariable = parts.join('_')
      const variable = prefixedVariable.substring(10)

      return [variable, value]
    }),
  )

  return output as CdkOutput
}
