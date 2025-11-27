'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const plan = searchParams.get('plan') || 'trial';

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Chamar API do Stripe para criar checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan,
          priceId: plan === 'paid' ? 'price_premium_14eur' : 'price_trial'
        })
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url; // Redireciona para Stripe Checkout
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#FFD700]" />
            <span className="font-bold text-xl">BarberBook</span>
          </div>
        </div>

        {/* Checkout Card */}
        <div className="rounded-3xl border-2 border-[#FFD700] bg-zinc-900 p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {plan === 'paid' ? 'Plano Premium' : 'Teste Grátis'}
            </h1>
            
            {plan === 'paid' ? (
              <>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-[#FFD700]">€14</span>
                  <span className="text-zinc-400 ml-2">hoje</span>
                </div>
                <p className="text-zinc-400 mb-2">+ 2 meses grátis (€58 de valor)</p>
                <p className="text-zinc-400">€29/mês após o período promocional</p>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-[#FFD700]">€0</span>
                  <span className="text-zinc-400 ml-2">por 7 dias</span>
                </div>
                <p className="text-zinc-400">€29/mês após o período de teste</p>
              </>
            )}
          </div>

          {/* Benefícios */}
          <div className="mb-8 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <span className="text-[#FFD700]">✓</span>
              <span>Sistema completo de agendamentos</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-[#FFD700]">✓</span>
              <span>Notificações WhatsApp automáticas</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-[#FFD700]">✓</span>
              <span>Gestão de clientes e horários</span>
            </div>
            {plan === 'paid' && (
              <>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-[#FFD700]">✓</span>
                  <span>Template WhatsApp profissional (€29)</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-[#FFD700]">✓</span>
                  <span>Suporte prioritário</span>
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Processando...'
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Ir para Pagamento Seguro
              </>
            )}
          </button>

          <p className="text-center text-sm text-zinc-500 mt-4">
            🔒 Pagamento processado com segurança pelo Stripe
          </p>
        </div>

        {/* Garantia */}
        <div className="mt-8 text-center">
          <p className="text-zinc-400 text-sm">
            ✓ Cancele quando quiser • ✓ Garantia de 7 dias • ✓ Sem permanência
          </p>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
