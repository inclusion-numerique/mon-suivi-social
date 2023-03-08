export const getNonceFromCspHeader = (cspHeaderValue?: string | null) => {
  if (!cspHeaderValue) {
    return
  }
  const directives = cspHeaderValue
    // Directives are split by ';'.
    .split(';')
    .map((directive) => directive.trim())

  // First try to find the directive for the 'script-src', otherwise try to
  // fallback to the 'default-src'.
  const srcDirective =
    directives.find((dir) => dir.startsWith('script-src')) ||
    directives.find((dir) => dir.startsWith('default-src'))
  // If no directive could be found, then we're done.
  if (!srcDirective) {
    return
  }
  // Extract the nonce from the directive
  const nonceString = srcDirective
    .split(' ')
    // Remove the 'strict-src'/'default-src' string, this can't be the nonce.
    .slice(1)
    .map((source) => source.trim())
    // Find the first source with the 'nonce-' prefix.
    .find(
      (source) =>
        source.startsWith("'nonce-") &&
        source.length > 8 &&
        source.endsWith("'"),
    )

  // Remove "'nonce-" and final "'"
  return nonceString?.slice(7, -1)
}
