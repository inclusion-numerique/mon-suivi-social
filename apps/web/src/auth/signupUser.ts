import { prismaClient } from '@mss/web/prismaClient'
import { AdapterUser } from 'next-auth/adapters'

// TODO MSS Is a kind of preauth needed ?
export const signupUser = async (
  user: Omit<AdapterUser, 'id'>,
): Promise<AdapterUser> => prismaClient.user.create({
    data: {
      ...user,
      role: 'ReceptionAgent',
    },
  })
