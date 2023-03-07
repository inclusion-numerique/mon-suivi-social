import { generateContentSecurityPolicyScriptNonce } from '@mss/web/utils/generateContentSecurityPolicyScriptNonce'

describe('generateContentSecurityPolicyScriptNonce.ts', () => {
  it('Generates random string', () => {
    const resultA = generateContentSecurityPolicyScriptNonce()
    const resultB = generateContentSecurityPolicyScriptNonce()

    expect(resultA).toBeString()
    expect(resultA.length).toBeGreaterThan(6)
    expect(resultA).not.toEqual(resultB)
  })
})
