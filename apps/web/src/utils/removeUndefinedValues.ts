export const removeUndefinedValues = <V>(data: {
  [index: string]: V
}): { [index: string]: Exclude<V, undefined> } => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  ) as { [index: string]: Exclude<V, undefined> }
}
