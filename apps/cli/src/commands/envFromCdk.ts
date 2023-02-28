// eslint-disable-next-line unicorn/prevent-abbreviations
import 'tsconfig-paths/register'

import { getCdkOutput } from '@mss/cdk/getCdkOutput'
import { appendFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const main = async () => {
  const cdkOutput = await getCdkOutput()
  const dotenvFile = resolve(
    dirname(fileURLToPath(import.meta.url)),
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
