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

export const createPreviewSubdomain = (
  namespace: string,
  previewDomain: string,
) => {
  // DNS record has to be 63 chars or shorter
  const maxRecordLength = 63
  // But validation seems to fail for shorter records so we add a buffer
  const validationFailureBuffer = 4
  // We will add a ".", also remove 1
  const maxNamespaceLength =
    maxRecordLength - validationFailureBuffer - 1 - previewDomain.length

  if (namespace.length > maxNamespaceLength) {
    return `${namespace.slice(0, maxNamespaceLength)}.${previewDomain}`
  }
  return `${namespace}.${previewDomain}`
}
