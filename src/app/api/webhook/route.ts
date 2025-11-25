export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura ausente" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Erro na verificação do webhook:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Processar eventos do Stripe
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Salvar assinatura no Supabase
        const { error } = await supabase.from("subscriptions").insert({
          customer_email: session.customer_email,
          customer_name: session.metadata?.customerName,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan_type: session.metadata?.planType,
          status: "active",
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Erro ao salvar assinatura:", error);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Atualizar status da assinatura
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Erro ao atualizar assinatura:", error);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Marcar assinatura como cancelada
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Erro ao cancelar assinatura:", error);
        }
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
