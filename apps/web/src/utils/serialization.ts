import superjson from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { Decimal } from 'decimal.js'

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js',
)

// Helper type to obfuscate serialized data
export type Serialized<T> = { __serialized: Symbol }

export const serialize = <T>(data: T): Serialized<T> =>
  superjson.serialize(data) as any as Serialized<T>

export const deserialize = <T>(data: Serialized<T>): T =>
  superjson.deserialize(data as any as SuperJSONResult) as T

export const transformer = { serialize, deserialize }
