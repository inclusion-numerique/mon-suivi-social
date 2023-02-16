import { format } from 'date-fns'

export function formatDateTime(date: Date): string
export function formatDateTime(date: Date | undefined): string | undefined
export function formatDateTime(date: Date | null): string | null
export function formatDateTime(
  date: Date | undefined | null,
): string | undefined | null
export function formatDateTime(
  date: Date | undefined | null,
): string | undefined | null {
  if (!date) {
    return date
  }
  return format(date, "dd/MM/yyyy HH'h'mm")
}
