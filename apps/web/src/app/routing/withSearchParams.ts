import { removeUndefinedValues } from '@mss/web/utils/removeUndefinedValues'

// Adds search params to a url
// Lax typing on params and removes undefined params for ease of use

export const withSearchParams =
  <T extends Record<string, string | undefined>>(
    base: string,
  ): ((parameters?: T) => string) =>
  (parameters?: T) => {
    if (!parameters) {
      return base
    }
    const definedParameters = removeUndefinedValues(parameters)
    const parametersString = new URLSearchParams(definedParameters).toString()
    if (!parametersString) {
      return base
    }
    return `${base}?${parametersString}`
  }
