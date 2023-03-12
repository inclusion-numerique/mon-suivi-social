/**
 * Output fonction for CLI Commands.
 * Express the intent for CLI output instead of debug console.log that are
 * forbidden by our lint rules
 */
// eslint-disable-next-line no-console
export const output = console.log
