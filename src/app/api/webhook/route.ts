import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  // Inicializar Stripe apenas quando necessário
  const stripe = getStripe()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Processar eventos do Stripe
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (userId) {
        // Atualizar status da assinatura
        await supabase
          .from('users')
          .update({
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId)

        // Registrar pagamento
        await supabase.from('payments').insert({
          user_id: userId,
          stripe_payment_id: session.payment_intent as string,
          amount: session.amount_total || 0,
          status: 'succeeded',
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Desativar conta
      await supabase
        .from('users')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      // Marcar como pagamento atrasado
      await supabase
        .from('users')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      // Reativar conta
      await supabase
        .from('users')
        .update({ subscription_status: 'active' })
        .eq('stripe_customer_id', customerId)

      // Registrar pagamento
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (user) {
        await supabase.from('payments').insert({
          user_id: user.id,
          stripe_payment_id: invoice.payment_intent as string,
          amount: invoice.amount_paid,
          status: 'succeeded',
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
