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

export const emailSignin = {
  text: ({ url }: { url: string }): string => {
    return `Pour vous connecter à ${PublicConfig.productTitle}, merci d'utiliser le lien suivant :\n${url}\n\n`
  },
  mjml: ({ url }: { url: string }): string =>
    renderToMjml(
      <Mjml>
        <MjmlHead>
          <MjmlTitle>{`Connexion à ${PublicConfig.productTitle}`}</MjmlTitle>
          <MjmlPreview>
            Voici votre lien de connexion sécurisé à usage unique :
          </MjmlPreview>
        </MjmlHead>
        <MjmlBody width={500}>
          <MjmlSection>
            <MjmlColumn>
              <MjmlImage
                width={200}
                src={emailAssetUrl('/images/logo.svg')}
                alt={PublicConfig.productTitle}
              />
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection>
            <MjmlColumn>
              <MjmlText>
                Voici votre lien de connexion sécurisé à usage unique :
              </MjmlText>
              <MjmlButton padding="20px" backgroundColor="#4550e5" href={url}>
                Se connecter
              </MjmlButton>
              <MjmlText>
                Si vous n'avez pas demandé à recevoir cet email, vous pouvez
                l'ignorer en toute sécurité.
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
        </MjmlBody>
      </Mjml>,
    ),
}
