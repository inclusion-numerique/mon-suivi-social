import Script from 'next/script'

// The Next <Script> tag expect a nonce as Next directly inject the code from the script file in an inline <script> tag
export const Matomo = ({ nonce }: { nonce?: string }) =>
  process.env.NODE_ENV === 'production' ? (
    <Script nonce={nonce} src="/matomo/matomo.min.js" strategy="lazyOnload" />
  ) : null
