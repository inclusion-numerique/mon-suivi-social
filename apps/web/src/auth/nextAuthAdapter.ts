import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prismaClient } from '@mss/web/prismaClient'
import { signupUser } from './signupUser'
import type { Adapter } from 'next-auth/adapters'

const prismaAdapter = PrismaAdapter(prismaClient)

// ⚠️ Keycloak returns non standard fields that are expected to be ignored by the client
const nonStandardKeycloakFieldsToIgnore = [
  'refresh_expires_in',
  'not-before-policy',
]

const removeNonStandardFields = <T extends Record<string, unknown>>(
  data: T,
): T => {
  for (const key of nonStandardKeycloakFieldsToIgnore) {
    if (key in data) {
      delete data[key]
    }
  }
  return data
}

export const nextAuthAdapter: Adapter = {
  ...prismaAdapter,
  // Custom signup
  createUser: signupUser,
  // Custom link acount
  linkAccount: (account) =>
    prismaAdapter.linkAccount(removeNonStandardFields(account)),
}
