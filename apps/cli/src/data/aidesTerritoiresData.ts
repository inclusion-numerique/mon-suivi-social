import { resolve } from 'path'
import {
  consoleOutput,
  getDataRows,
  Output,
} from '@mss/cli/data/csvDataHelpers'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import axios from 'axios'
import { prismaClient } from '@mss/web/prismaClient'
import { chunk } from 'lodash'
import { dataDirectory } from '@mss/cli/data/data'
import { stringify } from 'csv-stringify'
import { isRecordToUpdateNotFoundError } from '@mss/web/src/data/prismaError'

const dataSourceUrl = 'https://aides-territoires.beta.gouv.fr/api/perimeters/'

// Api has pages 1 based
const getPerimetersPageUrl = (page: number) => `${dataSourceUrl}?page=${page}`

// ['id', 'text', 'name', 'scale', 'zipcodes', 'code']
type PerimeterDataRow = [string, string, string, string, string | null, string]

const destinationDirectory = dataDirectory
const filename = 'aides-territoires_perimeters.csv'

const destination = resolve(destinationDirectory, filename)

type PerimetersApiData = {
  count: number
  next: string | null
  previous: string | null
  results: PerimetersApiItem[]
}

type PerimetersApiItem = {
  id: string
  text: string
  name: string
  scale: string
  zipcodes: string[]
  code: string
}

export const getPerimetersData = async (output: Output = consoleOutput) => {
  output(`Preparing download to ${destinationDirectory}`)
  if (!existsSync(destinationDirectory)) {
    output(`Creating ${destinationDirectory}`)
    await mkdir(destinationDirectory, { recursive: true })
  }
  output(`Downloading data file located at ${dataSourceUrl}`)
  const { data } = await axios.get<PerimetersApiData>(getPerimetersPageUrl(1))
  const pages = Math.ceil(data.count / data.results.length)
  output(`Downloading ${data.count} items in ${pages} api pages`)

  // already have first page
  const pagesUrls = Array.from({ length: pages - 1 }).map((_, index) =>
    // Start at page 2, end at {pages}
    getPerimetersPageUrl(index + 2),
  )

  // Make requests in chunk to not ddos their service
  const urlChunks = chunk(pagesUrls, 20)
  const results: PerimetersApiItem[] = [...data.results]
  for (const chunkIndex in urlChunks) {
    const urls = urlChunks[chunkIndex]
    const pagesData = await Promise.all(
      urls.map((url: string) =>
        axios.get<PerimetersApiData>(url).then(({ data }) => data.results),
      ),
    )
    results.push(...pagesData.flat())
    output(`Downloaded batch ${parseInt(chunkIndex) + 1} / ${urlChunks.length}`)
  }

  const csvArray = [
    ['id', 'text', 'name', 'scale', 'zipcodes', 'code'],
    ...results.map(({ id, text, name, scale, zipcodes, code }) => [
      id,
      text,
      name,
      scale,
      zipcodes,
      code,
    ]),
  ]
  const csvString = await new Promise<string>((res, rej) => {
    stringify(csvArray, (err, output) => {
      if (err) {
        return rej(err)
      }
      res(output)
    })
  })

  await writeFile(destination, csvString)
  output(`Data filed downloaded to ${destination}`)
}

export const mergePerimeters = async (output: Output = consoleOutput) => {
  if (!existsSync(destination)) {
    throw new Error(
      `Data data source should have been downloaded to ${destination}`,
    )
  }

  const rows = await getDataRows<PerimeterDataRow>(destination)
  const epciPerimeters: PerimeterDataRow[] = []
  const municipalityPerimeters: PerimeterDataRow[] = []
  for (const item of rows) {
    if (item[3] === 'EPCI') {
      epciPerimeters.push(item)
      continue
    }
    if (item[3] === 'Commune') {
      municipalityPerimeters.push(item)
    }
  }
  output(
    `Updating ${epciPerimeters.length} EPCI and ${municipalityPerimeters.length} municipalities from ${rows.length} aides territoires perimeters`,
  )

  output(`Updating ${epciPerimeters.length} EPCIs`)
  const epciPerimetersChunks = chunk(epciPerimeters, 100)
  for (const chunkIndex in epciPerimetersChunks) {
    output(
      `Updating municipalities perimeters batch ${parseInt(chunkIndex) + 1}/${
        epciPerimetersChunks.length
      }`,
    )
    const chunkRows = epciPerimetersChunks[chunkIndex]
    await Promise.all(
      chunkRows.map(([id, _text, _name, _scale, _zipcodes, code]) =>
        prismaClient.intercommunality
          .update({
            where: { code },
            data: { aidesTerritoiresId: id },
          })
          .catch((err) => {
            if (isRecordToUpdateNotFoundError(err)) {
              return
            }
            throw err
          }),
      ),
    )
  }

  output(`Updating ${municipalityPerimeters.length} municipalities`)
  const municipalityPerimetersChunks = chunk(municipalityPerimeters, 100)
  for (const chunkIndex in municipalityPerimetersChunks) {
    output(
      `Updating municipalities perimeters batch ${parseInt(chunkIndex) + 1}/${
        municipalityPerimetersChunks.length
      }`,
    )
    const chunkRows = municipalityPerimetersChunks[chunkIndex]
    await Promise.all(
      chunkRows.map(([id, _text, _name, _scale, _zipcodes, code]) =>
        prismaClient.municipality
          .update({
            where: { code },
            data: { aidesTerritoiresId: id },
          })
          .catch((err) => {
            if (isRecordToUpdateNotFoundError(err)) {
              return
            }
            throw err
          }),
      ),
    )
  }

  output(`Updated successfuly`)
}
