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
  // Better handle case of missing session when deleting. It should not crash auth process.
  deleteSession: async (sessionToken) => {
    try {
      await prismaAdapter.deleteSession(sessionToken)
    } catch (err) {
      // See https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        !!err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === 'P2025'
      ) {
        // Ok, the session was already destroyed by another process
        return
      }
      throw err
    }
  },
  // Custom signup
  createUser: signupUser,
  // Custom link acount
  linkAccount: (account) =>
    prismaAdapter.linkAccount(removeNonStandardFields(account)),
}
