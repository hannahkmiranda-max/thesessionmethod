'use client'

import Script from 'next/script'

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18126609251"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18126609251');
          
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
                'send_to': 'AW-18126609251/s79_CJrB6qQcEOO2uMND',
                'value': 1.0,
                'currency': 'USD',
                'transaction_id': '',
                'event_callback': callback
            });
            return false;
          }
        `}
      </Script>
    </>
  )
}
