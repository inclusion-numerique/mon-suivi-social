import { branch } from 'git-rev-sync'

export const getBranch = () => {
  return process.env.CDK_FORCE_BRANCH || branch()
}

export const computeBranchNamespace = (branch: string) =>
  branch.replace(/\/|_|\.|@/g, '-').toLowerCase()

export const namespacer = (namespace: string) => (name: string) =>
  `${name}-${namespace}`

export const generateDatabaseUrl = ({
  user,
  password,
  host,
  port,
  name,
}: {
  user: string
  password: string
  host: string
  port: number
  name: string
}) =>
  `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`
