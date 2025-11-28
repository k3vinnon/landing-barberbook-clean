import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: Request) {
  try {
    console.log('📥 API create-checkout chamada');
    
    const body = await request.json();
    console.log('📊 Body recebido:', body);
    
    const { plan } = body;
    
    // Definir Price ID baseado no plano
    let priceId: string;
    
    if (plan === 'paid') {
      // PLANO PREMIUM €14
      priceId = 'price_1SYYrdF4nbnoxp4fhV4PsBhL'; // ← VOCÊ VAI COLAR!
    } else {
      // TESTE GRÁTIS - criar como trial
      priceId = 'price_1SYYt3F4nbnoxp4f0qT8TPuQ'; // ← VOCÊ VAI COLAR!
    }
    
    console.log('💳 Criando checkout session com priceId:', priceId);
    
    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      mode: plan === 'paid' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout?plan=${plan}&canceled=true`,
      customer_email: body.email || undefined,
      metadata: {
        plan: plan,
      },
      // Para teste grátis, adicionar trial
      ...(plan === 'trial' && {
        subscription_data: {
          trial_period_days: 7,
        },
      }),
    });
    
    console.log('✅ Checkout session criada:', session.id);
    console.log('🔗 URL do checkout:', session.url);
    
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      success: true 
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao criar checkout:', error);
    
    return NextResponse.json({ 
      error: error.message,
      success: false
    }, { status: 500 });
  }
}
