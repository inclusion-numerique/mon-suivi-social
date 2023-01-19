export type Option<T = string> = { name: string; value: T }
export type Options<T = string> = Option<T>[]
export type OptionsGroups<T = string> = { [key: string]: Options<T> }

export const labelsToOptions = <T extends string>(
  object: Record<T, string>,
): Options<T> =>
  Object.entries(object).map(([value, name]) => ({ name, value } as Option<T>))
