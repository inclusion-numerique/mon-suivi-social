// eslint-disable-next-line unicorn/prevent-abbreviations
import 'tsconfig-paths/register'

import { getCdkOutput } from '@mss/cdk/getCdkOutput'
import { appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const main = async () => {
  const cdkOutput = await getCdkOutput()
  const dotenvFile = resolve(
    // eslint-disable-next-line unicorn/prefer-module
    __dirname,
    '../../../../.env',
  )
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
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
