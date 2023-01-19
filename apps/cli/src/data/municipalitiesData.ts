import { resolve } from 'path'
import {
  consoleOutput,
  downloadFile,
  getDataRows,
  Output,
} from '@mss/cli/data/csvDataHelpers'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { dataDirectory } from '@mss/cli/data/data'
import { chunk, forEach } from 'lodash'
import { upsert } from '@mss/web/data/upsert'
import { prismaClient } from '@mss/web/src/prismaClient'

const fields = [
  // Some territories (TAAF) have no EPCI, we do not include them for now
  'epci_code',
  'com_name',
  'com_code',
  'arrdep_code',
  // When arrdep_name not available (TOM), use arrdep_code instead
  'arrdep_name',
  'dep_code',
  'com_arm_siren_code',
]

const dataSourceUrl = `https://public.opendatasoft.com/explore/dataset/georef-france-commune-arrondissement-municipal/download/?format=csv&fields=${fields.join(
  ',',
)}&timezone=Europe/Berlin&lang=fr&use_labels_for_header=false&csv_separator=%2C`

const destinationDirectory = dataDirectory
const filename = 'opendatasoft_commune-arrondissement-municipal.csv'
const gristFilename = 'grist_municipalities.csv'

const openDataDestination = resolve(destinationDirectory, filename)
const gristDataFile = resolve(destinationDirectory, gristFilename)

export const getMunicipalitiesAndDistrictsData = async (
  output: Output = consoleOutput,
) => {
  output(`Preparing download to ${destinationDirectory}`)
  if (!existsSync(destinationDirectory)) {
    output(`Creating ${destinationDirectory}`)
    await mkdir(destinationDirectory, { recursive: true })
  }
  // The url redirects to the freshest data csv file
  // const { headers } = await getHeaders(dataSourceUrl)
  // if (!headers.location) {
  //   throw new Error(
  //       `Data gouv data source should redirect to csv file. (${dataSourceUrl})`,
  //   )
  // }
  output(`Downloading data file located at ${dataSourceUrl}`)
  await downloadFile(dataSourceUrl, destinationDirectory, filename)
  output(`Data filed downloaded to ${openDataDestination}`)
}

const mergeOpenDataRows = async (output: Output, rows: string[][]) => {
  // For now, do not consider municipalities without intercommunality
  const missingDistricts = ['242900074', '200067072']
  const cleanRows = rows
    .filter((row) => !!row[0])
    // FIXME Missing districts from district dataset. Should be fixed by having an up to date dataset
    .filter((row) => !missingDistricts.includes(row[0]))

  output(
    `Considering ${cleanRows.length} municipalities, from ${
      rows.length
    } total municipalities (${
      rows.length - cleanRows.length
    } without valid intercommunality or district)`,
  )

  // Create and merge Districts
  const districts = new Map(
    cleanRows.map(([_0, _1, _2, code, name, countyCode]) => [
      code,
      [code, name, countyCode],
    ]),
  )

  output(`Updating ${districts.size} districts`)
  await upsert(
    'District',
    'code',
    ['name', 'countyCode'],
    [...districts.values()],
  )
  output(`Updated ${districts.size} districts`)
}

const mergeGristRows = async (output: Output, rows: string[][]) => {
  const existingIntercommunalities =
    await prismaClient.intercommunality.findMany()

  const intercommunalitiesCodes = new Set(
    existingIntercommunalities.map(({ code }) => code),
  )

  // These intercommunalities code are not present in the other dataset for intercommunalities data :(
  const missingIntercommunalities = ['242900074', '200067072']

  const wierdDistrictCodes: Record<string, string> = {
    '9711': '9719711',
    '9712': '9719712',
    '9721': '9729721',
    '9722': '9729722',
    '9723': '9729723',
    '9724': '9729724',
    '9731': '9739731',
    '9732': '9739732',
    '9741': '9749741',
    '9742': '9749742',
    '9743': '9749743',
    '9744': '9749744',
  }

  const cleanRows = rows.map((row) => {
    const [
      _type,
      code,
      rawIntercommunality,
      _region,
      _county,
      _ctcd,
      districtCode,
      _tncc,
      _capName,
      _nameWithoutParticle,
      name,
      _can,
      rawParentCode,
      ,
    ] = row
    // rawIntercommunality is like Epci[200071751] | null
    let intercommunalityCode = rawIntercommunality
      ? rawIntercommunality.substring(5, 14)
      : null

    // There is wierd fucked up data to cleanup
    if (
      intercommunalityCode === 'ZZZZ' ||
      missingIntercommunalities.includes(intercommunalityCode ?? '')
    ) {
      intercommunalityCode = null
    }
    // XXX Check this with data territoires
    let cleanDistrictCode =
      districtCode in wierdDistrictCodes
        ? wierdDistrictCodes[districtCode]
        : districtCode

    if (districtCode === '' && code.startsWith('976')) {
      cleanDistrictCode = '976ZZZZ'
    }
    // rawParentCode can be empty string
    const parentCode = !!rawParentCode ? rawParentCode : null

    return [code, name, intercommunalityCode, cleanDistrictCode, parentCode]
  })

  const municipalitiesWithoutParent: typeof cleanRows = []
  const municipalitiesWithParent: typeof cleanRows = []
  const municipalitiesWithoutIntercommunality: typeof cleanRows = []

  const parentMunicipalitiesEpciCode = new Map<string, string | null>()
  for (const row of cleanRows) {
    const parentCode = row.at(-1)
    if (parentCode === undefined) {
      throw new Error('parentCode should not be undefined')
    }
    if (parentCode !== null) {
      municipalitiesWithParent.push(row)
      parentMunicipalitiesEpciCode.set(parentCode, null)
      continue
    }
    if (!row[2]) {
      municipalitiesWithoutIntercommunality.push(row)
      continue
    }

    municipalitiesWithoutParent.push(row)
  }
  console.log('WITHOUT EPCI', municipalitiesWithoutIntercommunality)

  // Municipalities with parent needs the same epci as their parent
  municipalitiesWithoutParent.forEach((row) => {
    const code = row[0]
    if (!code) {
      throw new Error('municipality code should be defined')
    }
    if (!parentMunicipalitiesEpciCode.has(code)) {
      return
    }
    parentMunicipalitiesEpciCode.set(code, row[2])
  })

  municipalitiesWithParent.forEach((row) => {
    const parentCode = row.at(-1)
    if (parentCode === undefined || parentCode === null) {
      throw new Error('parentCode should not be undefined')
    }
    const intercommunalityCode = parentMunicipalitiesEpciCode.get(parentCode)
    if (!intercommunalityCode) {
      throw new Error(
        `Municipality ${parentCode} do not have an intercommunality`,
      )
    }
    row[2] = intercommunalityCode
  })

  output(
    `Considering ${cleanRows.length} municipalities, from ${
      rows.length
    } total municipalities (${
      rows.length - cleanRows.length
    } without valid intercommunality or district)`,
  )

  const chunkSize = 1000
  // One indexed to match console output
  const debugChunk: number | null = null
  const municipalityChunks = chunk(municipalitiesWithoutParent, chunkSize)
  for (const chunkIndex in municipalityChunks) {
    if (debugChunk && chunkIndex === `${debugChunk - 1}`) {
      console.log(municipalityChunks[chunkIndex])
      throw new Error('Debugging chunk')
    }
    output(
      `Updating municipalities batch ${parseInt(chunkIndex) + 1}/${
        municipalityChunks.length
      }`,
    )
    const chunkRows = municipalityChunks[chunkIndex]
    await upsert(
      'Municipality',
      'code',
      ['name', 'intercommunalityCode', 'districtCode', 'parentCode'],
      chunkRows,
    )
  }

  await upsert(
    'Municipality',
    'code',
    ['name', 'intercommunalityCode', 'districtCode', 'parentCode'],
    municipalitiesWithParent,
  )
  output(`Updated ${cleanRows.length} municipalities`)
  output(
    `${municipalitiesWithoutIntercommunality.length} municipalities without an intercommunality were ignored`,
  )
}

export const mergeMunicipalitiesAndDistrictsData = async (
  output: Output = consoleOutput,
) => {
  if (!existsSync(openDataDestination)) {
    throw new Error(
      `Data data source should have been downloaded to ${openDataDestination}`,
    )
  }

  output(`Parsing data at ${openDataDestination}`)
  const [_header, ...rows] = await getDataRows(openDataDestination)
  const [_gristHeader, ...gristRows] = await getDataRows(gristDataFile)
  output(`Got ${rows.length} rows`)
  await mergeOpenDataRows(output, rows)
  await mergeGristRows(output, gristRows)
}
