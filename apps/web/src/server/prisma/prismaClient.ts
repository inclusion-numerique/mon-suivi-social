import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

export const prismaClient =
  global.prismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prismaClient
}
