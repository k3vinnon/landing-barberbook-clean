import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Cliente Stripe para frontend (lazy loading)
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Cliente Stripe para backend (server-side) com lazy loading
let stripeInstance: Stripe | null = null

export const getStripe = () => {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY não está configurada')
    }
    
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia',
    })
  }
  
  return stripeInstance
}

export default getStripe
