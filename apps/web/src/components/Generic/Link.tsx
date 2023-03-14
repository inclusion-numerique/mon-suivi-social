import NextLink from 'next/link'
import { ComponentProps } from 'react'
import { PublicWebAppConfig } from '@mss/web/webAppConfig'

/**
 * Use this link to be able to globally deactivate prefetching in development environments
 */
export const Link = (props: ComponentProps<typeof NextLink>) => (
  <NextLink
    {...props}
    prefetch={PublicWebAppConfig.disableLinkPrefetch ? false : props.prefetch}
  />
)
