export const addAsterisk = (value: string, add = true): string =>
  add ? `${value} *` : value
