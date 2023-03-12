import '@mss/web/auth/nextAuthSetup'
import EmailProvider from 'next-auth/providers/email'
import KeycloakProvider, { KeycloakProfile } from 'next-auth/providers/keycloak'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { ServerWebAppConfig, PublicWebAppConfig } from '@mss/web/webAppConfig'
import { sendVerificationRequest } from '@mss/web/auth/sendVerificationRequest'
import { nextAuthAdapter } from '@mss/web/auth/nextAuthAdapter'
import { Routes } from '@mss/web/app/routing/routes'
import { inclusionConnectProviderId } from '@mss/web/auth/inclusionConnect'

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
      ...ServerWebAppConfig.Auth.Email,
      sendVerificationRequest,
    }),
    KeycloakProvider({
      // Allow an email user to login with Inclusion Connect
      allowDangerousEmailAccountLinking: true,
      id: inclusionConnectProviderId,
      name: 'Inclusion Connect',
      clientId: PublicWebAppConfig.InclusionConnect.clientId,
      clientSecret: ServerWebAppConfig.InclusionConnect.clientSecret,
      // KeycloakProvider adds wellknown open id config path
      issuer: PublicWebAppConfig.InclusionConnect.issuer,
      profile: (profile: KeycloakProfile) => ({
        id: profile.sub,
        name: profile.name ?? profile.preferred_username,
        email: profile.email,
        image: profile.picture,
      }),
    }),
  ],
  callbacks: {
    signIn: () => true,
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
