import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const priceIds = {
  'monthly': 'price_1SameqF4nbnoxp4fqCnWuqVZ',
  'annual': 'price_1Samg5F4nbnoxp4fgb7gxssl',
  'trial': 'price_1SamhdF4nbnoxp4fNhc8xnsf'
};

export async function POST(request: NextRequest) {
  try {
    const { plan, name, email, whatsapp } = await request.json();

    // Validar dados
    if (!plan || !name || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (!priceIds[plan as keyof typeof priceIds]) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceIds[plan as keyof typeof priceIds],
        quantity: 1,
      }],
      customer_email: email,
      metadata: {
        name: name,
        whatsapp: whatsapp,
        plan: plan
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/${plan}`,
    };

    // Adicionar trial APENAS para plano "trial"
    if (plan === 'trial') {
      sessionConfig.subscription_data = {
        trial_period_days: 7
      };
    }

    console.log('=== DEBUG CHECKOUT ===');
    console.log('Plan recebido:', plan);
    console.log('Price ID usado:', priceIds[plan]);
    console.log('Session config:', JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Session URL criada:', session.url);
    console.log('======================');

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}