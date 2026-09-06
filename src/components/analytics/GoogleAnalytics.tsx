'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId?: string
}

export function GoogleAnalytics({
  gaId = process.env.GA_ID || 'G-CGTVL8CGG5',
}: GoogleAnalyticsProps) {
  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
