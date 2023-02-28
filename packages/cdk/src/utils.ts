import { branch as gitBranch } from 'git-rev-sync'

export const getBranch = () => {
  return process.env.CDK_FORCE_BRANCH || gitBranch()
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

export const createPreviewSubdomain = (
  namespace: string,
  previewDomain: string,
) => {
  // DNS record has to be 63 chars or shorter
  const maxRecordLength = 63
  // We will add a ".", also remove 1
  const maxNamespaceLength = maxRecordLength - 1 - previewDomain.length

  let subdomain = namespace.slice(0, maxNamespaceLength)

  // Remove trailing hyphen
  if (subdomain[subdomain.length - 1] === '-') {
    subdomain = subdomain.slice(0, -1)
  }

  return { hostname: `${subdomain}.${previewDomain}`, subdomain }
}
