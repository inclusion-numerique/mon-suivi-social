import { format as dateFnsFormat } from 'date-fns'

export type DateFormatOptions = {
  locale?: Locale
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  firstWeekContainsDate?: number
  useAdditionalWeekYearTokens?: boolean
  useAdditionalDayOfYearTokens?: boolean
}

export function formatDate(
  date: Date,
  format: string,
  options?: DateFormatOptions,
): string
export function formatDate(
  date: Date | undefined,
  format: string,
  options?: DateFormatOptions,
): string | undefined
export function formatDate(
  date: Date | null,
  format: string,
  options?: DateFormatOptions,
): string | null
export function formatDate(
  date: Date | undefined | null,
  format: string,
  options?: DateFormatOptions,
): string | undefined | null
export function formatDate(
  date: Date | undefined | null,
  format: string,
  options?: DateFormatOptions,
): string | undefined | null {
  if (!date) {
    return date
  }
  return dateFnsFormat(date, format, options)
}

type DateFormatter = {
  (date: Date): string
  (date: Date | null): string | null
  (date: Date | undefined): string | undefined
  (date: Date | null | undefined): string | null | undefined
}

export const dateFormatter = (
  format: string,
  options?: DateFormatOptions,
): DateFormatter =>
  ((date) => formatDate(date, format, options)) as DateFormatter
