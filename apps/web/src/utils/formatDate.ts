import { format } from 'date-fns'

export function formatDate(date: Date): string
export function formatDate(date: Date | undefined): string | undefined
export function formatDate(date: Date | null): string | null
export function formatDate(
  date: Date | undefined | null,
): string | undefined | null
export function formatDate(
  date: Date | undefined | null,
): string | undefined | null {
  if (!date) {
    return date
  }
  return format(date, 'dd/MM/yyyy')
}
