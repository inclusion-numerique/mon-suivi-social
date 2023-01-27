import React from 'react'

import {
  Mjml,
  MjmlBody,
  MjmlButton,
  MjmlColumn,
  MjmlHead,
  MjmlImage,
  MjmlPreview,
  MjmlSection,
  MjmlText,
  MjmlTitle,
  renderToMjml,
} from '@luma-team/mjml-react'
import { PublicConfig } from '@mss/web/config'
import { emailAssetUrl } from '@mss/emails/emailAssetUrl'
import { MjmlAll, MjmlAttributes, MjmlFont } from 'mjml-react'

export const emailSignin = {
  text: ({ url }: { url: string }): string => {
    return `Pour vous connecter à ${PublicConfig.productTitle}, merci d'utiliser le lien suivant :\n${url}\n\n`
  },
  mjml: ({ url }: { url: string }): string =>
    renderToMjml(
      <Mjml>
        <MjmlHead>
          <MjmlFont name="Marianne" href={emailAssetUrl('/email/fonts.css')} />
          <MjmlAttributes>
            <MjmlAll fontFamily="Marianne, Open Sans, Helvetica, Arial, sans-serif" />
          </MjmlAttributes>
          <MjmlTitle>{`Connexion à ${PublicConfig.productTitle}`}</MjmlTitle>
          <MjmlPreview>
            Voici votre lien de connexion sécurisé à usage unique :
          </MjmlPreview>
        </MjmlHead>
        <MjmlBody width={500} backgroundColor="#F6F6F6">
          <MjmlSection>
            <MjmlColumn backgroundColor="white">
              <MjmlImage
                width={200}
                src={emailAssetUrl('/images/logo.svg')}
                alt={PublicConfig.productTitle}
              />
              <MjmlText>
                Voici votre lien de connexion sécurisé à usage unique&nbsp;:
              </MjmlText>
              <MjmlButton padding="20px" backgroundColor="#4550e5" href={url}>
                Se connecter
              </MjmlButton>
              <MjmlText>
                Si vous n&apos;avez pas demandé à recevoir cet email, vous
                pouvez l&apos;ignorer en toute sécurité.
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
        </MjmlBody>
      </Mjml>,
    ),
}
