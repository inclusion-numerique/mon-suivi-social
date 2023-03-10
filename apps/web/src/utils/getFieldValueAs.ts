export type GetFieldValueAsOptions = {
  valueAsNumber?: boolean
  valueAsDate?: boolean
  valueAsBoolean?: boolean
}

export const getFieldValueAs = (
  value: string | null | undefined,
  { valueAsNumber, valueAsDate, valueAsBoolean }: GetFieldValueAsOptions,
) => {
  if (typeof value === 'string' && value.trim() === '') {
    return null
  }

  if (!valueAsNumber && !valueAsDate && !valueAsBoolean) {
    return value
  }

  if (value === undefined || value === null) {
    return value
  }

  // TODO useful ?
  if (value === '') {
    return
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
