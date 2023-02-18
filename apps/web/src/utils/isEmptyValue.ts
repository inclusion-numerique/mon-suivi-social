export const isEmptyValue = <T>(value: T): boolean => {
  if (value === null || value === undefined) {
    return true
  }
  // Empty array []
  if (Array.isArray(value)) {
    return value.length === 0
  }

  // Empty object {}
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  // Empty string '  '
  if (typeof value === 'string') {
    return value.trim() === ''
  }

  return false
}
