import { SendVerificationRequestParams } from 'next-auth/providers'
import { createTransport } from 'nodemailer'
import { emailSignin } from '@mss/web/email/templates/emailSignin'
import { compileMjml } from '@mss/web/email/mjml'

const debugMagicLink = true

export const sendVerificationRequest = async ({
  url,
  provider,
  identifier,
}: SendVerificationRequestParams) => {
  // For quicker dev UX, display url in console in dev environment
  if (debugMagicLink) {
    console.log(`[AUTH] Magic link for ${identifier}: ${url}`)
  }

  const { host } = new URL(url)
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Connexion à Mon Suivi Social`,
    text: emailSignin.text({ url, host }),
    html: compileMjml(emailSignin.mjml({ url, host })),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
  }
}
