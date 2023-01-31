import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { getSessionUser } from '@mss/web/auth/getSessionUser'

export const createSecurityCheck =
  <Target extends {}, Params extends {}>(
    securityRule: (
      grantee: SecurityRuleGrantee,
      target: Target,
      params: Params,
    ) => boolean,
    user?: SessionUser,
  ): ((target: Target, params: Params) => Promise<boolean>) =>
  (target, params) =>
    user
      ? Promise.resolve(securityRule(user, target, params))
      : getSessionUser().then((user) =>
          !user ? false : securityRule(user, target, params),
        )
