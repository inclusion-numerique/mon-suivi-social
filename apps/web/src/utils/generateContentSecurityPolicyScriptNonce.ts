import { nanoid } from 'nanoid'

export const generateContentSecurityPolicyScriptNonce = (): string => nanoid(32)
