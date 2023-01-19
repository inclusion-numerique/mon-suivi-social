export const getAge = (birthDate: Date): number => {
  const ageDelta = new Date(Date.now() - birthDate.getTime())
  return Math.abs(ageDelta.getUTCFullYear() - 1970)
}
