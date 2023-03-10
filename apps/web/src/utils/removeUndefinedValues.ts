export const removeUndefinedValues = <V>(data: {
  [index: string]: V
}): { [index: string]: Exclude<V, undefined> } => Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as { [index: string]: Exclude<V, undefined> }
