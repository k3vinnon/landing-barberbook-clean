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

// Função para detectar URL base automaticamente
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
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

    const baseUrl = getBaseUrl();

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
      success_url: `${baseUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/${plan}`,
    };

    // Adicionar trial APENAS para plano "trial"
    if (plan === 'trial') {
      sessionConfig.subscription_data = {
        trial_period_days: 7
      };
    }

    console.log('=== DEBUG CHECKOUT ===');
    console.log('Base URL detectada:', baseUrl);
    console.log('Plan recebido:', plan);
    console.log('Price ID usado:', priceIds[plan as keyof typeof priceIds]);
    console.log('Success URL:', sessionConfig.success_url);
    console.log('Cancel URL:', sessionConfig.cancel_url);
    console.log('======================');

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Session URL criada:', session.url);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
