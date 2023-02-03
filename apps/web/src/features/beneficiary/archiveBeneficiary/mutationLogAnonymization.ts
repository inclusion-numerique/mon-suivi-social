export type AnonymizedObject<T> = Partial<T>

export type AnonymizationFunction<T> = (input: T) => AnonymizedObject<T>

const anonymizationFunctions = new Map<string, AnonymizationFunction<any>>()

export const addMutationLogToBeneficiaryAnonymization = <T>(
  featureName: string,
  anonymization: AnonymizationFunction<T>,
) => anonymizationFunctions.set(featureName, anonymization)

export const getAnonymizationForFeature = (
  featureName: string,
): AnonymizationFunction<any> | undefined =>
  anonymizationFunctions.get(featureName)
