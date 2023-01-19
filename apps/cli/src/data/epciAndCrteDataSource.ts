import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import {
  consoleOutput,
  downloadFile,
  getDataRows,
  getHeaders,
  Output,
} from '@mss/cli/data/csvDataHelpers'
import { dataDirectory } from '@mss/cli/data/data'
import { chunk } from 'lodash'
import { upsert } from '@mss/web/data/upsert'

const dataSourceUrl =
  'https://www.data.gouv.fr/fr/datasets/r/cf3d2117-3ce8-4f26-af0b-7a86af450862'

const destinationDirectory = dataDirectory
const filename = 'datagouv_epci-and-crte.csv'

const destination = resolve(destinationDirectory, filename)

export const getEpciAndCrteData = async (output: Output = consoleOutput) => {
  output(`Preparing download to ${destinationDirectory}`)
  if (!existsSync(destinationDirectory)) {
    output(`Creating ${destinationDirectory}`)
    await mkdir(destinationDirectory, { recursive: true })
  }
  // The url redirects to the freshest data csv file
  const { headers } = await getHeaders(dataSourceUrl)
  if (!headers.location) {
    throw new Error(
      `Data gouv data source should redirect to csv file. (${dataSourceUrl})`,
    )
  }
  output(`Downloading data file located at ${headers.location}`)
  await downloadFile(headers.location, destinationDirectory, filename)
  output(`Data filed downloaded to ${destination}`)
}

const _rowHeaders = [
  'insee_reg',
  'lib_reg',
  'dep_chef_file',
  'lib_dep',
  'id_crte',
  'lib_crte',
  'type_grp_crte',
  'crte_interreg',
  'crte_interdep',
  'siren_groupement',
  'lib_groupement',
  'nature_juridique',
  'siren_grp_supra',
  'lib_grp_supra',
  'nat_jur_grp_supra',
] as const

const mergeRows = async (output: Output, rows: string[][]) => {
  // Create and merge Regions
  const regions = new Map(rows.map(([code, name]) => [code, [code, name]]))

  output(`Updating ${regions.size} regions`)

  await upsert('Region', 'code', ['name'], [...regions.values()])

  // Create and merge Counties
  const counties = new Map(
    rows.map(([regionCode, _1, code, name]) => [
      code,
      [code, regionCode, name],
    ]),
  )

  output(`Updating ${counties.size} counties`)
  await upsert('County', 'code', ['regionCode', 'name'], [...counties.values()])

  // Create and merge CRTE
  const crtes = new Map(
    rows.map(([_0, _1, _2, _3, code, name]) => [code, [code, name]]),
  )
  output(`Updating ${crtes.size} CRTEs`)

  const crteChunks = chunk([...crtes.values()], 200)

  for (const chunkIndex in crteChunks) {
    output(
      `Updating crte batch ${parseInt(chunkIndex) + 1}/${crteChunks.length}`,
    )
    const crtes = crteChunks[chunkIndex]
    await upsert('Crte', 'code', ['name'], crtes)
  }
  output(`Updated ${crtes.size} CRTEs`)

  output(`Updating ${rows.length} intercommunalities`)

  // There are duplicated intercommunalities (example code siren 200054781 )
  // TODO is this rightly handled ?
  // XXX this is ugly code, just dedupe using a Map or something...
  const codeIndex = 9
  const duplicatesCounts = rows.reduce((result, current) => {
    result.set(current[codeIndex], (result.get(current[codeIndex]) ?? 0) + 1)
    return result
  }, new Map<string, number>())
  const duplicatedCodes = new Set(
    [...duplicatesCounts.entries()]
      .filter(([_code, count]) => count > 1)
      .map(([code]) => code),
  )
  const deduplicated = new Set<string>()

  const cleanRows = rows
    .map(([_0, _1, _2, _3, crteCode, _5, _6, _7, _8, code, name]) => [
      code,
      crteCode,
      name,
    ])
    // Only allow one row for each duplicated code
    .filter(([code]) => {
      if (deduplicated.has(code)) {
        return false
      }
      if (duplicatedCodes.has(code)) {
        deduplicated.add(code)
        return true
      }
      return true
    })

  const intercommunalityChunks = chunk(cleanRows, 200)

  for (const chunkIndex in intercommunalityChunks) {
    output(
      `Updating intercommunalities batch ${parseInt(chunkIndex) + 1}/${
        intercommunalityChunks.length
      }`,
    )
    const chunkRows = intercommunalityChunks[chunkIndex]
    await upsert('Intercommunality', 'code', ['crteCode', 'name'], chunkRows)
  }
  output(`Updated ${rows.length} intercommunailities`)
}

export const mergeEpciAndCrteData = async (output: Output = consoleOutput) => {
  if (!existsSync(destination)) {
    throw new Error(
      `Data data source should have been downloaded to ${destination}`,
    )
  }

  output(`Parsing data at ${destination}`)
  const [_header, ...rows] = await getDataRows(destination)
  output(`Got ${rows.length} rows`)
  await mergeRows(output, rows)
}
