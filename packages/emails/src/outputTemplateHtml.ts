import { existsSync, promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { compileMjml } from './mjml'

const outputDirectory = resolve(
  // eslint-disable-next-line unicorn/prefer-module
  __dirname,
  '../var/email',
)

async function outputDirectoryIfItDoesNotExist(): Promise<void> {
  if (existsSync(outputDirectory)) {
    return
  }

  await fs.mkdir(outputDirectory, { recursive: true })
}

export async function outputHtmlTemplate(
  name: string,
  htmlContent: string,
): Promise<void> {
  await outputDirectoryIfItDoesNotExist()
  await fs.writeFile(`${outputDirectory}/${name}.html`, htmlContent)
}

export async function outputMjmlTemplate(
  name: string,
  mjmlTemplate: string,
): Promise<void> {
  const htmlContent = compileMjml(mjmlTemplate)
  await outputHtmlTemplate(name, htmlContent)
  await fs.writeFile(`${outputDirectory}/${name}.mjml`, mjmlTemplate)
}

export function createHtmlTemplateOutput(
  templateName: string,
): (htmlContent: string) => Promise<void> {
  let index = 0
  return (htmlContent: string): Promise<void> =>
    // eslint-disable-next-line no-plusplus
    outputHtmlTemplate(`${templateName}_${index++}`, htmlContent)
}

/**
 * Outputs mjml AND compiled html version to test that mjml syntax is valid
 * It is then easy to debug templates in /var/email
 */
export function createMjmlTemplateOutput(
  templateName: string,
): (templateName: string) => Promise<void> {
  let index = 0
  return (mjmlTemplate: string): Promise<void> =>
    // eslint-disable-next-line no-plusplus
    outputMjmlTemplate(`${templateName}_${index++}`, mjmlTemplate)
}
