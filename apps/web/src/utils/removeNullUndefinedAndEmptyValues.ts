type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

// Remove empty strings, empty arrays, empty objects, null and undefined values from object
export const removeNullUndefinedAndEmptyValues = <T>(
  data: T,
): NoUndefinedField<T> => {
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(
      ([_, value]) =>
        // Remove null and undefined
        value !== null &&
        value !== undefined &&
        // Remove empty object {}
        (typeof value !== 'object' || Object.keys(value).length > 1) &&
        // Remove empty array []
        (!Array.isArray(value) || value.length > 1) &&
        // Remove empty string '  '
        (typeof value !== 'string' || value.trim() !== ''),
    ),
  ) as NoUndefinedField<T>
}
