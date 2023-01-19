import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prismaClient } from '@mss/web/prismaClient'
import { signupUser } from './signupUser'

export const nextAuthAdapter = {
  ...PrismaAdapter(prismaClient),
  createUser: signupUser,
}
