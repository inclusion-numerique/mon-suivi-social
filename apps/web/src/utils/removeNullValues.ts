export const removeNullValues = <V>(data: {
  [index: string]: V
}): { [index: string]: V extends null ? undefined : V } => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null),
  ) as { [index: string]: V extends null ? undefined : V }
}
