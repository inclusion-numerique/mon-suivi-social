export const findSecretIdByName = <Secret extends { id: string; name: string }>(
  secrets: Secret[],
  name: string,
): Secret => {
  const found = secrets.find((secret) => secret.name === name)
  if (!found) {
    throw new Error(`Secret "${name}" does not exists or is not accessible`)
  }
  return found
}
