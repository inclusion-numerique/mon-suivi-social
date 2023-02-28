import 'tsconfig-paths/register'

import { getCdkOutput } from '@mss/cdk/getCdkOutput'
import { appendFile } from 'fs/promises'
import { resolve } from 'path'

export const main = async () => {
  const cdkOutput = await getCdkOutput()
  const dotenvFile = resolve(__dirname, '../../../../.env')
  await appendFile(
    dotenvFile,
    `
DATABASE_URL=${cdkOutput.databaseUrl}
WEB_BASE_URL=${cdkOutput.webBaseUrl}
`,
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
