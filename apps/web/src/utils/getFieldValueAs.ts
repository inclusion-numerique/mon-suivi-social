export type GetFieldValueAsOptions = {
  valueAsNumber?: boolean
  valueAsDate?: boolean
  valueAsBoolean?: boolean
}

export const getFieldValueAs = (
  value: string | null | undefined,
  { valueAsNumber, valueAsDate, valueAsBoolean }: GetFieldValueAsOptions,
) => {
  if (!valueAsNumber && !valueAsDate && !valueAsBoolean) {
    return value
  }

  if (value === undefined || value === null) {
    return value
  }

  if (value === '') {
    return undefined
  }

  if (valueAsNumber) {
    return +value
  }

  if (valueAsDate) {
    return new Date(value)
  }
  if (valueAsBoolean) {
    return value === 'true'
  }
  throw new Error('Missed a case in getFieldValueAs()')
}
