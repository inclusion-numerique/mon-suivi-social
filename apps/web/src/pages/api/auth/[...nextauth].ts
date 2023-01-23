import '@mss/web/auth/nextAuthSetup'
import EmailProvider from 'next-auth/providers/email'
import KeycloakProvider, { KeycloakProfile } from 'next-auth/providers/keycloak'

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
    // Inclusion connect est un keycloak de base
    // See https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/keycloak.ts for options
    // TODO MSS AUTH_KEYCLOAK_PARAMS__FROM="monsuivisocial" utilisé par inclusion connect pour titre

    // Realm review_apps pour les review app

    // FLOW pour une structure
    // Créé un resp de structure
    // > Cela envoie un email pour renseigner ses user
    // Créé des users > créé dans la table directus user
    //  > Auth échoue
    //  > Cela envoie un email connecte toi sur mon suivi social

    // Login inclusion à la main https://recette.connect.inclusion.beta.gouv.fr/realms/local/protocol/openid-connect/logout
    // Pas déco d'inclusion connect car cela deconnecterai d'autre profils
    // https://recette.connect.inclusion.beta.gouv.fr/realms/local/account/#/
    // A venir page profil accessible

    // Un postgres keycloak inclusion connect, demanderai
    // Voir avec Antoine pour un audit sécu / stabilité infra inclusion connect

    KeycloakProvider({
      // Allow an email user to login with Inclusion Connect
      allowDangerousEmailAccountLinking: true,
      id: 'inclusion-connect',
      name: 'Inclusion Connect',
      clientId: PrivateConfig.InclusionConnect.clientId,
      clientSecret: PrivateConfig.InclusionConnect.clientSecret,
      issuer: PrivateConfig.InclusionConnect.issuer,

      profile: (profile: KeycloakProfile) => {
        console.log('PROFILE FROM INCLUSION', profile)
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
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
