export type Option<T = string> = { name: string; value: T; disabled?: boolean }
export type Options<T = string> = Option<T>[]
export type OptionsGroups<T = string> = { [key: string]: Options<T> }

export const labelsToOptions = <T extends string>(
  object: Record<T, string>,
): Options<T> =>
  Object.entries(object).map(([value, name]) => ({ name, value } as Option<T>))

export const arrayToOptions = <T extends string>(
  values: readonly T[] | T[],
): Options<T> =>
  values.map((value) => ({
    name: value,
    value,
  }))
