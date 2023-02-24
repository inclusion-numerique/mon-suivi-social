import { PrivateConfig } from '@mss/web/config'

export function GET() {
  if (PrivateConfig.isMain) {
    return new Response(`User-agent: *
Allow: /
`)
  }

  // Do not index preview environments
  return new Response(`User-agent: *
Disallow: /
`)
}
