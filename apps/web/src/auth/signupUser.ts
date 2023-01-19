import { prismaClient } from '@mss/web/prismaClient'
import { AdapterUser } from 'next-auth/adapters'

// TODO Unit test this and see if a pre-auth is needed ?
export const signupUser = async (
  user: Omit<AdapterUser, 'id'>,
): Promise<AdapterUser> => {
  return prismaClient.user.create({
    data: {
      ...user,
    },
  })
}
