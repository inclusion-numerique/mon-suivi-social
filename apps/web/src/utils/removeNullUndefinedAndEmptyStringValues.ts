type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

export const removeNullUndefinedAndEmptyStringValues = <T>(
  data: T,
): NoUndefinedField<T> => {
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (typeof value !== 'string' || value.trim() !== ''),
    ),
  ) as NoUndefinedField<T>
}
