import { User, Organisation } from '@prisma/client'

export type SessionUserOrganisation = Pick<Organisation, 'id' | 'name'>

// Serializable user interface
export type SessionUser = Omit<
  User,
  'created' | 'updated' | 'emailVerified'
> & {
  organisation: SessionUserOrganisation | null
}

export type SessionUserAgent = Omit<SessionUser, 'organisationId'> & {
  organisationId: string
  organisation: SessionUserOrganisation
}
