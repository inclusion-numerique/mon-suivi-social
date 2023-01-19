// Deno has window in globals, use document
export const isBrowser = typeof document !== 'undefined'
