export type AnonymizedObject<T> = Partial<T>

// An anonymization function returns only the "redacted" fields
export type AnonymizationFunction<T> = (input: T) => AnonymizedObject<T>

const anonymizationFunctions = new Map<string, AnonymizationFunction<any>>()

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
): AnonymizationFunction<any> | undefined =>
  anonymizationFunctions.get(featureName)

export const applyAnonymization = <T>(
  dataToAnonymize: T | null | undefined,
  anonymizationFunction: AnonymizationFunction<T>,
) => {
  if (dataToAnonymize === null || dataToAnonymize === undefined) {
    return dataToAnonymize
  }

  return { ...dataToAnonymize, ...anonymizationFunction(dataToAnonymize) }
}
