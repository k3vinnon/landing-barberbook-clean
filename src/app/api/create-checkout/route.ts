export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 Recebido body:', body);
    
    const { plan, priceId } = body;
    console.log('📊 Plan:', plan, 'PriceId:', priceId);

    // Validação de parâmetros
    if (!plan) {
      console.error('❌ Parâmetro "plan" ausente');
      return NextResponse.json(
        { error: 'Parâmetro "plan" é obrigatório' },
        { status: 400 }
      );
    }

    // Definir preços baseado no plano
    const prices = {
      trial: {
        amount: 0,
        trialDays: 7,
        description: "Teste Grátis por 7 dias - Depois €29/mês",
      },
      paid: {
        amount: 1400, // €14,00 em centavos
        trialDays: 60, // 2 meses grátis
        description: "€14 hoje + 2 meses grátis (€58 de valor)",
      },
    };

    const selectedPrice = prices[plan as keyof typeof prices];

    if (!selectedPrice) {
      console.error('❌ Plano inválido:', plan);
      return NextResponse.json(
        { error: "Plano inválido. Use 'trial' ou 'paid'" },
        { status: 400 }
      );
    }

    console.log('✅ Preço selecionado:', selectedPrice);

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
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
        trial_period_days: selectedPrice.trialDays > 0 ? selectedPrice.trialDays : undefined,
        metadata: {
          planType: plan,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      metadata: {
        planType: plan,
      },
    });

    console.log('✅ Sessão criada:', session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("❌ ERRO COMPLETO:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { 
        error: error.message || "Erro ao processar pagamento",
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
