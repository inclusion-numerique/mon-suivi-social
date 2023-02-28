export type AnonymizedObject<T> = Partial<T>

// An anonymization function returns only the "redacted" fields
export type AnonymizationFunction<T> = (
  input: Partial<T>,
) => AnonymizedObject<T>

const anonymizationFunctions = new Map<string, AnonymizationFunction<unknown>>()

export const addMutationLogToBeneficiaryAnonymization = <T>(
  featureName: string,
  anonymization: AnonymizationFunction<T>,
) => {
  if (anonymizationFunctions.has(featureName)) {
    throw new Error(
      `Feature ${featureName} already have been declared. Please check that you have distinct feature names`,
    )
  }

  anonymizationFunctions.set(featureName, anonymization)
}

export const getAnonymizationForFeature = (
  featureName: string,
): AnonymizationFunction<Record<string, unknown>> | undefined =>
  anonymizationFunctions.get(featureName)

export const applyAnonymization = <T>(
  dataToAnonymize: T | null | undefined,
  anonymizationFunction: AnonymizationFunction<T>,
) => {
  if (dataToAnonymize === null || dataToAnonymize === undefined) {
    return {}
  }

  return { ...dataToAnonymize, ...anonymizationFunction(dataToAnonymize) }
}
