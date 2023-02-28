export const createNodeModulesTransformIgnorePattern = (
  modules: string[],
): string => {
  const packagesNamesPattern = modules.join('|')

  return `node_modules/(?!${packagesNamesPattern})`
}
