// Replaces all spaces in a string with NBSP
// Replaces all hyphens "-" with unbreakable hyphens "‑"
export const nonBreakable = <T>(value: T): T =>
  typeof value === 'string'
    ? (value.replaceAll(' ', ' ').replaceAll('-', '‑') as T)
    : value
