import { format } from 'date-fns'

export const dateToIsoDay = (date: Date) => format(date, 'yyyy-MM-dd')
