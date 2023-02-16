import { Options } from '@mss/web/utils/options'

export const zodEnumFromOptions = <T>(options: Options<T>): [T, ...T[]] =>
  options.map(({ value }) => value) as [T, ...T[]]

export const zodEnumFromObjectKeys = <T extends object>(
  object: T,
): [keyof T, ...(keyof T)[]] =>
  [...Object.keys(object)] as [keyof T, ...(keyof T)[]]

export const errorMessages = {
  required_error: 'Veuillez renseigner ce champ',
  invalid_type_error: 'Cette valeur est incorrecte',
}
