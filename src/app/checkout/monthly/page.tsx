'use client';

import { useState } from 'react';
import { Calendar, Check, Shield, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function MonthlyCheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      plan: 'monthly',
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
            <h1 className="text-3xl md:text-4xl font-bold">Checkout - Plano Mensal</h1>
          </div>
          <p className="text-zinc-400">Complete seu cadastro e comece a usar agora mesmo</p>
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
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
              >
                {loading ? 'Processando...' : 'Finalizar Pagamento - €29'}
              </button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                🔒 Pagamento 100% seguro e criptografado via Stripe
              </p>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            
            {/* Card do Plano */}
            <div className="bg-gradient-to-br from-green-500/10 to-black border-2 border-green-500 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-bold">Plano Mensal com Garantia</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-green-400 mb-2">€29<span className="text-lg text-zinc-400">/mês</span></p>
                <p className="text-sm text-zinc-400">Cobrança mensal recorrente</p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-center text-green-400 font-bold mb-2">
                  💰 GARANTIA HORMOZI
                </p>
                <p className="text-center text-sm text-zinc-300">
                  Se não fizer <strong>€1000 em agendamentos</strong> em 30 dias, devolvemos seu €29!
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Sistema completo de agendamento</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Lembretes automáticos WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Relatórios e análises completas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-bold">Cancele quando quiser</span>
                </div>
              </div>
            </div>

            {/* Resumo de Cobrança */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Resumo da Cobrança</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Plano Mensal</span>
                  <span className="font-bold">€29,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Desconto</span>
                  <span className="font-bold text-green-400">€0,00</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="font-bold">Total Hoje</span>
                  <span className="text-2xl font-bold text-green-400">€29,00</span>
                </div>
                <p className="text-xs text-zinc-500 text-center pt-2">
                  Próxima cobrança: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>

            {/* Garantia */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-bold text-blue-400 mb-3">🛡️ Garantia de 30 Dias</h3>
              <p className="text-sm text-blue-200">
                Se você não estiver satisfeito ou não atingir €1000 em agendamentos nos primeiros 30 dias, 
                devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}