import { User, Structure } from '@prisma/client'

export type SessionUserStructure = Pick<Structure, 'id' | 'name'>

// Serializable user interface
export type SessionUser = Omit<
  User,
  'created' | 'updated' | 'emailVerified'
> & {
  structure: SessionUserStructure | null
}

export type SessionUserAgent = Omit<SessionUser, 'structureId'> & {
  structureId: string
  structure: SessionUserStructure
}
