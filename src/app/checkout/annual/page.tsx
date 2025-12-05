'use client';

import { useState } from 'react';
import { Calendar, Check, Star, ArrowLeft, CreditCard, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AnnualCheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      plan: 'annual',
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string
    };

    // Validar campos
    if (!data.name || !data.email || !data.whatsapp) {
      alert('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar pagamento');
      }

      // Redirecionar para Stripe Checkout
      window.location.href = result.url;
    } catch (error: any) {
      alert(error.message || 'Erro ao processar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FFD700] transition-all mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-10 w-10 text-[#FFD700]" />
            <h1 className="text-3xl md:text-4xl font-bold">Checkout - Plano Anual</h1>
            <span className="bg-[#FFD700] text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Star className="h-4 w-4 fill-black" />
              MAIS ESCOLHIDO
            </span>
          </div>
          <p className="text-zinc-400">Economize €108/ano com o plano anual</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Formulário */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Nome Completo</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="João Silva"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">E-mail</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="joao@exemplo.com"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">WhatsApp</label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  placeholder="+351 912 345 678"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
              >
                {loading ? 'Processando...' : 'Finalizar Pagamento - €240'}
              </button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                🔒 Pagamento 100% seguro e criptografado via Stripe
              </p>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            
            {/* Card do Plano */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700] rounded-2xl p-8 shadow-2xl shadow-[#FFD700]/20">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-[#FFD700]" />
                <h3 className="text-xl font-bold">Plano Anual - Melhor Oferta</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#FFD700] mb-2">€240<span className="text-lg text-zinc-400">/ano</span></p>
                <p className="text-sm text-zinc-500 line-through">€348/ano (€29/mês)</p>
                <p className="text-lg font-bold text-green-400 mt-1">Economize €108/ano (20% OFF)</p>
              </div>

              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">✅ Economize:</span>
                    <span className="font-bold text-[#FFD700]">€108/ano</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">✅ Pagamento único:</span>
                    <span className="font-bold text-white">Sem mensalidades</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">✅ Churn:</span>
                    <span className="font-bold text-green-400">5x menor</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm">Sistema completo de agendamento</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm">Lembretes automáticos WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm">Relatórios e análises completas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm font-bold">Prioridade no suporte</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm font-bold">Acesso antecipado a novos recursos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm">Sem preocupação com renovação mensal</span>
                </div>
              </div>
            </div>

            {/* Resumo de Cobrança */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Resumo da Cobrança</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Plano Mensal (12 meses)</span>
                  <span className="font-bold line-through text-zinc-500">€348,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Desconto Anual (20%)</span>
                  <span className="font-bold text-green-400">-€108,00</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="font-bold">Total Hoje (Pagamento Único)</span>
                  <span className="text-2xl font-bold text-[#FFD700]">€240,00</span>
                </div>
                <p className="text-xs text-zinc-500 text-center pt-2">
                  Válido por 12 meses • Renovação: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>

            {/* Vantagens */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-green-400 mb-3">💰 Por Que Escolher o Anual?</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li>✅ <strong>Economize €108</strong> comparado ao plano mensal</li>
                <li>✅ <strong>Pague 1x e esqueça</strong> - sem preocupação mensal</li>
                <li>✅ <strong>Churn 5x menor</strong> - mais estabilidade para seu negócio</li>
                <li>✅ <strong>Prioridade no suporte</strong> - atendimento VIP</li>
                <li>✅ <strong>Acesso antecipado</strong> a novos recursos</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}