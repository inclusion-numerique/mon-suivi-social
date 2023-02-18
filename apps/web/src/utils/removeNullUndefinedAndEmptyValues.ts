import { isEmptyValue } from '@mss/web/utils/isEmptyValue'

type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

// Remove empty strings, empty arrays, empty objects, null and undefined values from object
export const removeNullUndefinedAndEmptyValues = <T>(
  data: T,
): NoUndefinedField<T> => {
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(
      ([_, value]) => !isEmptyValue(value),
    ),
  ) as NoUndefinedField<T>
}
