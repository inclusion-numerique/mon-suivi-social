import { PublicConfig } from '@mss/web/config'

export const inclusionConnectProviderId = 'inclusion-connect'

export const getInclusionConnectLogoutUrl = (): string =>
  `${PublicConfig.InclusionConnect.issuer}/protocol/openid-connect/logout`

export const getInclusionConnectProfilePageUrl = (): string =>
  `${PublicConfig.InclusionConnect.issuer}/account`

export const getInclusionConnectProfileIssuerUrl = (): string =>
  `${PublicConfig.InclusionConnect.issuer}/.well-known/openid-configuration`

export const getInclusionConnectChangePasswordUrl = (): string =>
  `${PublicConfig.InclusionConnect.issuer}/login-actions/reset-credentials?client_id=monsuivisocial`
