// Adds search params to a url
// Lax typing on params and removes undefined params for ease of use
import { removeUndefinedValues } from '@mss/web/utils/removeUndefinedValues'

export const withSearchParams =
  <T extends Record<string, string | undefined>>(
    base: string,
  ): ((params?: T) => string) =>
  (params?: T) => {
    if (!params) {
      return base
    }
    const definedParams = removeUndefinedValues(params)
    const paramsString = new URLSearchParams(definedParams).toString()
    if (!paramsString) {
      return base
    }
    return `${base}?${paramsString}`
  }
