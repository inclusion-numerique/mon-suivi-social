type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

// Remove empty strings, empty arrays, empty objects, null and undefined values from object
export const removeNullUndefinedAndEmptyValues = <T>(
  data: T,
): NoUndefinedField<T> => {
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(([_, value]) => {
      // Remove null and undefined
      if (value === null || value === undefined) {
        return false
      }
      // Remove empty array []
      if (Array.isArray(value)) {
        return value.length > 0
      }

      // Remove empty object {}
      if (typeof value === 'object') {
        return Object.keys(value).length > 0
      }

      // Remove empty string '  '
      if (typeof value === 'string') {
        return value.trim() !== ''
      }

      return true
    }),
  ) as NoUndefinedField<T>
}
