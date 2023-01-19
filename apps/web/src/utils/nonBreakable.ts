// Replace all spaces in a string with NBSP
export const nonBreakable = <T>(value: T): T =>
  typeof value === 'string' ? (value.replaceAll(' ', ' ') as T) : (value as T)
