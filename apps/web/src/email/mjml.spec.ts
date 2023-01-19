import { compileMjml } from './mjml'

describe('mjml', () => {
  it('Compiles mjml templates', () => {
    const result = compileMjml(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Hey
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`)

    expect(result).toContain('<!doctype html>')
    expect(result).toContain(
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">',
    )
    expect(result).toContain('<style type="text/css">')
    expect(result).toContain('>Hey</div>')
    expect(result).toContain('</body>')
  })
})
