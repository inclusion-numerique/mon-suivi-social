import { PublicWebAppConfig } from '@mss/web/webAppConfig'

export const inclusionConnectProviderId = 'inclusion-connect'

export const getInclusionConnectLogoutUrl = (): string =>
  `${PublicWebAppConfig.InclusionConnect.issuer}/protocol/openid-connect/logout`

export const getInclusionConnectProfilePageUrl = (): string =>
  `${PublicWebAppConfig.InclusionConnect.issuer}/account`

export const getInclusionConnectProfileIssuerUrl = (): string =>
  `${PublicWebAppConfig.InclusionConnect.issuer}/.well-known/openid-configuration`

export const getInclusionConnectChangePasswordUrl = (): string =>
  `${PublicWebAppConfig.InclusionConnect.issuer}/login-actions/reset-credentials?client_id=monsuivisocial`
