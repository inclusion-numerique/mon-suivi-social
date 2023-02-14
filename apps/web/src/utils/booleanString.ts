// Sometime we need to use strings to represent booleans in form inputs
export type BooleanString = 'true' | 'false'

export function booleanToString(value: boolean): BooleanString
export function booleanToString(value: boolean | null): BooleanString | null
export function booleanToString(
  value: boolean | undefined,
): BooleanString | undefined
export function booleanToString(
  value: boolean | undefined | null,
): BooleanString | undefined | null
export function booleanToString(
  value: boolean | null | undefined,
): BooleanString | null | undefined {
  return value === null || value === undefined
    ? value
    : value
    ? 'true'
    : 'false'
}

export function stringToBoolean(value: BooleanString): boolean
export function stringToBoolean(value: BooleanString | null): boolean | null
export function stringToBoolean(
  value: BooleanString | undefined,
): boolean | undefined
export function stringToBoolean(
  value: BooleanString | undefined | null,
): boolean | undefined | null
export function stringToBoolean(
  value: BooleanString | null | undefined,
): boolean | null | undefined {
  return
  value === null || value === undefined
    ? value
    : value === 'true'
    ? true
    : false
}
