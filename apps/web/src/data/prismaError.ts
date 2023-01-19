export const isRecordToUpdateNotFoundError = (
  error: unknown,
): error is {
  code: 'P2025'
  clientVersion: string
  batchRequestIdx?: string
  meta: { cause: 'Record to update not found.' }
} => {
  if (!error || typeof error !== 'object') {
    return false
  }
  return (
    'code' in error &&
    'meta' in error &&
    typeof error.meta === 'object' &&
    error.code === 'P2025'
  )
}
