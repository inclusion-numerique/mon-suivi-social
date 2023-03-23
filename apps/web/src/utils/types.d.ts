/**
 * Make optional provided keys K optionals in the type T
 */
export type PartialBy<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
