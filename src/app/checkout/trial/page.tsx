'use client';

import { useState } from 'react';
import { Calendar, Check, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TrialCheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      plan: 'trial',
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
            <Sparkles className="h-10 w-10 text-[#FFD700]" />
            <h1 className="text-3xl md:text-4xl font-bold">Teste Grátis de 7 Dias</h1>
          </div>
          <p className="text-zinc-400">Comece agora sem compromisso. Sem cartão de crédito necessário.</p>
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
                {loading ? 'Processando...' : 'Começar Teste Grátis'}
              </button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                🔒 Sem cobrança hoje. Teste grátis por 7 dias.
              </p>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            
            {/* Card do Plano */}
            <div className="bg-gradient-to-br from-green-500/10 to-black border-2 border-green-500 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-bold">Teste Grátis de 7 Dias</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-green-400 mb-2">€0<span className="text-lg text-zinc-400"> hoje</span></p>
                <p className="text-sm text-zinc-400">Depois €29/mês após o teste</p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-center text-green-400 font-bold mb-2">
                  🎁 TESTE GRÁTIS COMPLETO
                </p>
                <p className="text-center text-sm text-zinc-300">
                  Acesse todas as funcionalidades por 7 dias sem custo. Cancele quando quiser.
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
                  <span className="text-sm font-bold">Cancele a qualquer momento</span>
                </div>
              </div>
            </div>

            {/* Resumo de Cobrança */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Resumo da Cobrança</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Teste Grátis (7 dias)</span>
                  <span className="font-bold text-green-400">€0,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Plano Mensal após teste</span>
                  <span className="font-bold">€29,00/mês</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="font-bold">Total Hoje</span>
                  <span className="text-2xl font-bold text-green-400">€0,00</span>
                </div>
                <p className="text-xs text-zinc-500 text-center pt-2">
                  Próxima cobrança: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT')} (se não cancelar)
                </p>
              </div>
            </div>

            {/* Benefícios */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-bold text-blue-400 mb-3">✨ Por que testar grátis?</h3>
              <p className="text-sm text-blue-200">
                Experimente todas as funcionalidades sem risco. Se não gostar, cancele antes dos 7 dias e não paga nada.
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}