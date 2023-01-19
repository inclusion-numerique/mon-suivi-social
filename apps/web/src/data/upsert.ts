import { prismaClient } from '@mss/web/prismaClient'
import { mockProviders } from 'next-auth/client/__tests__/helpers/mocks'
import type = mockProviders.github.type

const doubleQuoted = (value: string) => `"${value}"`

export const upsert = (
  table: string,
  idColumn: string,
  dataColumns: string[],
  // id column first, then values for datacolumns in the same order as specified
  data: (string | number | null | boolean)[][],
): Promise<number> => {
  const quotedColumnNames = [idColumn, ...dataColumns]
    .map(doubleQuoted)
    .join(', ')

  const values = `${data
    .map(
      (values) =>
        `(${values
          .map((value) =>
            value === null
              ? 'null'
              : typeof value === 'number'
              ? value.toString(10)
              : typeof value === 'boolean'
              ? value
                ? 'true'
                : 'false'
              : `'${value.replaceAll("'", "''")}'`,
          )
          .join(',')})`,
    )
    .join(',')}`

  // (username, password, level, email) = (EXCLUDED.username, EXCLUDED.password, EXCLUDED.level, EXCLUDED.email)
  const excludedStatement = dataColumns
    .map(doubleQuoted)
    .map((column) => `${column} = EXCLUDED.${column}`)
    .join(',')

  return prismaClient.$executeRawUnsafe(
    `INSERT INTO "${table}" (${quotedColumnNames}) 
VALUES ${values}
ON CONFLICT ("${idColumn}")
DO UPDATE SET ${excludedStatement}`,
  )
}
