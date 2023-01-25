import { emailSignin } from '@mss/emails/templates/emailSignin'
import { createMjmlTemplateOutput } from '../outputTemplateHtml'

describe('Template: emailSignin', () => {
  const output = createMjmlTemplateOutput('emailSignin')

  it('Compiles hello world react mjml template', () => {
    const mjml = emailSignin.mjml({
      url: 'https://test.local?token=oui',
    })

    expect(mjml).toContain('Connexion')
    expect(mjml).toContain('https://test.local?token=oui')

    output(mjml)
  })
})