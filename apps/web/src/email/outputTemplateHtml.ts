import { existsSync, promises as fs } from 'fs'
import { resolve } from 'path'
import { compileMjml } from './mjml'

const varDir = resolve(__dirname, '../../var/email')

async function createEmailVarDirIfItDoesNotExist(): Promise<void> {
  if (existsSync(varDir)) {
    return
  }

  await fs.mkdir(varDir)
}

export async function outputHtmlTemplate(
  name: string,
  htmlContent: string,
): Promise<void> {
  await createEmailVarDirIfItDoesNotExist()
  await fs.writeFile(`${varDir}/${name}.html`, htmlContent)
}

export async function outputMjmlTemplate(
  name: string,
  mjmlTemplate: string,
): Promise<void> {
  const htmlContent = compileMjml(mjmlTemplate)
  await outputHtmlTemplate(name, htmlContent)
  await fs.writeFile(`${varDir}/${name}.mjml`, mjmlTemplate)
}

export function htmlTemplateOutputFactory(
  templateName: string,
): (htmlContent: string) => Promise<void> {
  let i = 0
  return (htmlContent: string): Promise<void> => {
    return outputHtmlTemplate(`${templateName}_${i++}`, htmlContent)
  }
}

/**
 * Outputs mjml AND compiled html version to test that mjml syntax is valid
 * It is then easy to debug templates in /var/email
 */
export function mjmlTemplateOutputFactory(
  templateName: string,
): (templateName: string) => Promise<void> {
  let i = 0
  return (mjmlTemplate: string): Promise<void> => {
    return outputMjmlTemplate(`${templateName}_${i++}`, mjmlTemplate)
  }
}
