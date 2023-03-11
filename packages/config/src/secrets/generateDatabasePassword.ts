import { nanoid } from 'nanoid'

// It respects the constraints of scaleway RDB passwords :
// password must be between 8 and 128 characters, contain at least one digit, one uppercase, one lowercase and one special character
export const generateDatabasePassword = () => `Pw4#${nanoid(48)}`
