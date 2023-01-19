import { createHash } from 'crypto'

// Database passwords are generated using a secret common to cdk stack and web stack and an unsafe value
// that is scoped to the username of the database
// It respects the constraints of scaleway RDB passwords :
// password must be between 8 and 128 characters, contain at least one digit, one uppercase, one lowercase and one special character
//⚠️ A change to this algorithm will break connections between web app containers and database in production ⚠️
export const generateDatabasePassword = (secret: string, value: string) =>
  `Pw4#${createHash('sha256').update(`${secret}${value}`).digest('base64')}`
