/**
 * NOTE: This requires `@sentry/nextjs` version 7.3.0 or higher.
 *
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://reactjs.org/docs/error-boundaries.html
 */

import * as Sentry from '@sentry/nextjs'
import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'
import NextErrorComponent from 'next/error'

const CustomErrorComponent: NextPage<ErrorProps> = (properties) => (
  <NextErrorComponent statusCode={properties.statusCode} />
)

const statusCodesErrorPages = {
  '404': '/404',
  '401': '/401',
  '403': '/403',
  '500': '/500',
} as Record<string, string>

CustomErrorComponent.getInitialProps = async (contextData) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData)

  if (contextData.res) {
    // Redirect to error page if status code match and path is different
    const statusCode = contextData.res.statusCode.toString()
    const redirectPath = statusCodesErrorPages[statusCode]

    if (redirectPath && contextData.asPath !== redirectPath) {
      contextData.res.writeHead(301, {
        Location: redirectPath,
      })
      contextData.res.end()
    }
  }

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData)
}

export default CustomErrorComponent
