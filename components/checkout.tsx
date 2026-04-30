'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Checkout({ 
  productId,
  onComplete 
}: { 
  productId: string
  onComplete?: () => void 
}) {
  const fetchClientSecret = useCallback(async () => {
    const clientSecret = await startCheckoutSession(productId)
    if (!clientSecret) {
      throw new Error('Failed to get client secret')
    }
    return clientSecret
  }, [productId])

  const handleComplete = useCallback(() => {
    // Google Ads purchase conversion tracking
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-18126609251/s79_CJrB6qQcEOO2uMND',
        'value': 1.0,
        'currency': 'USD',
        'transaction_id': ''
      })
    }
    
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret, onComplete: handleComplete }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
