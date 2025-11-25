export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { planType, email, name } = await req.json();

    // Definir preços baseado no plano
    const prices = {
      trial: {
        amount: 0,
        trialDays: 14,
        description: "Teste Grátis por 14 dias - Depois R$79/mês",
      },
      paid: {
        amount: 3900, // R$39,00 em centavos
        trialDays: 0,
        description: "R$39 hoje + 3 meses grátis (R$237 de valor)",
      },
    };

    const selectedPrice = prices[planType as keyof typeof prices];

    if (!selectedPrice) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      );
    }

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "BarberBook - Sistema de Agendamento",
              description: selectedPrice.description,
            },
            unit_amount: selectedPrice.amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: selectedPrice.trialDays,
        metadata: {
          planType,
          customerName: name,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      metadata: {
        planType,
        customerEmail: email,
        customerName: name,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
