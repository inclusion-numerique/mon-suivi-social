import { resolve } from 'path'
import { consoleOutput, Output } from '@mss/cli/data/csvDataHelpers'
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import axios from 'axios'
import { dataDirectory } from '@mss/cli/data/data'
import { upsert } from '@mss/web/data/upsert'

const dataSourceUrl = 'https://aides-territoires.beta.gouv.fr/api/themes/'

const destinationDirectory = dataDirectory
const filename = 'aides-territoires_themes-and-categories.json'

const destination = resolve(destinationDirectory, filename)

type CategoriesApiData = {
  count: number
  next: string | null
  previous: string | null
  results: [
    {
      id: number
      name: string
      slug: string
      categories: [
        {
          id: number
          name: string
          slug: string
        },
      ]
    },
  ]
}

export const getCategoriesData = async (output: Output = consoleOutput) => {
  output(`Preparing download to ${destinationDirectory}`)
  if (!existsSync(destinationDirectory)) {
    output(`Creating ${destinationDirectory}`)
    await mkdir(destinationDirectory, { recursive: true })
  }
  output(`Downloading data file located at ${dataSourceUrl}`)
  const { data } = await axios.get<CategoriesApiData>(dataSourceUrl)
  if (data.next) {
    throw new Error(
      'Categories API is now paginated, cannot load categories until this is implemented on our side.',
    )
  }
  await writeFile(destination, JSON.stringify(data, null, 2))
  output(`Data filed downloaded to ${destination}`)
}

export const mergeCategories = async (output: Output = consoleOutput) => {
  if (!existsSync(destination)) {
    throw new Error(
      `Data data source should have been downloaded to ${destination}`,
    )
  }

  const dataString = await readFile(destination, 'utf-8')
  const data: CategoriesApiData = JSON.parse(dataString)

  output(`Updating ${data.results.length} themes`)
  await upsert(
    'ProjectTheme',
    'id',
    ['slug', 'name'],
    data.results.map(({ id, slug, name }) => [id.toString(10), slug, name]),
  )
  output(`Updated ${data.results.length} themes`)

  const categories = data.results
    .map(({ categories, id: themeId }) =>
      categories.map((category) => [
        category.id.toString(10),
        category.slug,
        category.name,
        themeId.toString(10),
      ]),
    )
    .flat()

  output(`Updating ${categories.length} categories`)
  await upsert('ProjectCategory', 'id', ['slug', 'name', 'themeId'], categories)
  output(`Updated ${categories.length} categories`)
}
