import '@mss/web/auth/nextAuthSetup'
import EmailProvider from 'next-auth/providers/email'
import KeycloakProvider from 'next-auth/providers/keycloak'

import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrivateConfig } from '@mss/web/config'
import { sendVerificationRequest } from '@mss/web/auth/sendVerificationRequest'
import { nextAuthAdapter } from '@mss/web/auth/nextAuthAdapter'
import { Routes } from '@mss/web/app/routing/routes'

const inclusionConnectRealmUrl = (path: string) =>
  `${PrivateConfig.InclusionConnect.baseUrl}/realms/${PrivateConfig.InclusionConnect.realm}${path}`

export const authOptions: NextAuthOptions = {
  adapter: nextAuthAdapter,
  pages: {
    signIn: Routes.Connexion.Login,
    signOut: Routes.Connexion.Logout,
    error: Routes.Connexion.Erreur,
    verifyRequest: Routes.Connexion.Verification,
  },
  providers: [
    EmailProvider({
      ...PrivateConfig.Auth.Email,
      sendVerificationRequest,
    }),
    // See https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/keycloak.ts for options
    KeycloakProvider({
      id: 'inclusion-connect',
      name: 'Inclusion Connect',
      clientId: PrivateConfig.InclusionConnect.clientId,
      clientSecret: PrivateConfig.InclusionConnect.clientSecret,
      issuer: PrivateConfig.InclusionConnect.issuer,
      profile: (profile) => {
        console.log('PROFILE FROM INCLUSION', profile)
        return {
          id: profile.id,
          name: profile.kakao_account?.profile.nickname,
          email: profile.kakao_account?.email,
          image: profile.kakao_account?.profile.profile_image_url,
        }
      },
    }),
  ],
  callbacks: {
    signIn: () => {
      return true
    },
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
