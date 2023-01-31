const valuesNotInSet = <T>(values: T[], set: Set<T>): T[] =>
  values.filter((value) => !set.has(value))

// Order does not matter
// Only works for scalar values or object if it is the same refs, consider a === comparison
export const computeArrayDiff = <T>(
  initial: T[],
  updated: T[],
): { added: T[]; removed: T[] } => {
  const initialSet = new Set(initial)
  const updatedSet = new Set(updated)

  return {
    added: valuesNotInSet(updated, initialSet),
    removed: valuesNotInSet(initial, updatedSet),
  }
}
