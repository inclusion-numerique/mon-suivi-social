export const pick = <K extends keyof T, T>(items: T[], key: K): T[K][] =>
  items.map((item) => item[key])
