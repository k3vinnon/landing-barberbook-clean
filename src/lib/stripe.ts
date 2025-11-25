import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const createCheckoutSession = async (
  planType: "trial" | "paid",
  email: string,
  name: string
) => {
  try {
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planType,
        email,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao criar sessão de checkout");
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao criar checkout:", error);
    throw error;
  }
};
