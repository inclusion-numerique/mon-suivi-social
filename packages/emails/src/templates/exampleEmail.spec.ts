import { emailSignin } from '@mss/emails/templates/exampleEmail'
import { createMjmlTemplateOutput } from '../outputTemplateHtml'

describe('Template: emailSignin', () => {
  const output = createMjmlTemplateOutput('emailSignin')

  it('Compiles hello world react mjml template', async () => {
    const mjml = emailSignin.mjml({
      url: 'https://test.local?token=oui',
    })

    expect(mjml).toContain('Connexion')
    expect(mjml).toContain('https://test.local?token=oui')

    await output(mjml)
  })
})
