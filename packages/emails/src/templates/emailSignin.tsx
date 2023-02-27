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
import { MjmlAll, MjmlAttributes, MjmlFont, MjmlSpacer } from 'mjml-react'

const brandColor = '#4550e5'
const backgroundColor = '#F6F6F6'

export const emailSignin = {
  text: ({ url }: { url: string }): string => {
    // eslint-disable-next-line no-irregular-whitespace
    return `Pour vous connecter à ${PublicConfig.productTitle}, merci d'utiliser le lien suivant :\n${url}\n\n`
  },
  mjml: ({ url }: { url: string }): string =>
    renderToMjml(
      <Mjml>
        <MjmlHead>
          <MjmlFont name="Marianne" href={emailAssetUrl('/email/fonts.css')} />
          <MjmlAttributes>
            <MjmlAll fontFamily="Marianne, Helvetica, Arial, sans-serif" />
            <MjmlSection backgroundColor="white" />
            <MjmlButton
              backgroundColor={brandColor}
              borderRadius={24}
              fontSize="16px"
              lineHeight="24px"
              fontWeight={400}
              innerPadding="8px 16px"
            />
            <MjmlText fontSize="16px" lineHeight="24px" fontWeight={400} />
          </MjmlAttributes>
          <MjmlTitle>{`Connexion à ${PublicConfig.productTitle}`}</MjmlTitle>
          <MjmlPreview>
            Voici votre lien de connexion sécurisé à usage unique :
          </MjmlPreview>
        </MjmlHead>
        <MjmlBody backgroundColor={backgroundColor}>
          {/*Section used for a bit of headroom at the top*/}
          <MjmlSection backgroundColor={backgroundColor} />
          {/*Header with logos*/}
          <MjmlSection paddingBottom="8px">
            <MjmlColumn width="24%" verticalAlign="middle">
              <MjmlImage
                align="left"
                src={emailAssetUrl('/email/fr.svg')}
                alt="République Française"
              />
            </MjmlColumn>
            <MjmlColumn width="76%" verticalAlign="middle">
              <MjmlImage
                align="left"
                width={160}
                src={emailAssetUrl('/email/logo.svg')}
                alt={PublicConfig.productTitle}
              />
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection paddingTop={0}>
            <MjmlColumn>
              <MjmlText fontWeight={600} fontSize="28px" color={brandColor}>
                Connexion à {PublicConfig.productTitle}
              </MjmlText>
              <MjmlSpacer height="16px" />
              <MjmlText>
                Voici votre lien de connexion sécurisé à usage unique&nbsp;:
              </MjmlText>
              <MjmlButton align="left" href={url}>
                Se connecter
              </MjmlButton>
              <MjmlText>
                Si vous n&apos;avez pas demandé à recevoir cet email, vous
                pouvez l&apos;ignorer en toute sécurité.
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
          {/*Section used for a bit of padding at the bottom*/}
          <MjmlSection backgroundColor={backgroundColor} />
        </MjmlBody>
      </Mjml>,
    ),
}
