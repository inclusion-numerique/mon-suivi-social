export function serializeDate(date: Date): string
export function serializeDate(date: Date | null): string | null
export function serializeDate(date: null): null
export function serializeDate(
  date: Date | null | undefined,
): string | null | undefined
export function serializeDate(
  date: Date | null | undefined,
): string | null | undefined {
  return date ? date.toISOString() : date
}
