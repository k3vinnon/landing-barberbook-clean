'use client';

import { useState } from 'react';
import { Calendar, Check, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TrialCheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      barbershopName: formData.get('barbershopName') as string,
      whatsapp: formData.get('whatsapp') as string,
      plan: 'trial'
    };

    try {
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Erro ao criar conta. Tente novamente.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Erro ao criar conta. Verifique sua conexão e tente novamente.');
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
            <Calendar className="h-10 w-10 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold">Teste Grátis por 7 Dias</h1>
          </div>
          <p className="text-zinc-400">Experimente todos os recursos sem pagar nada</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Formulário */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Comece Seu Teste Grátis</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Nome Completo</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="João Silva"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">E-mail</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="joao@exemplo.com"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Nome da Barbearia</label>
                <input 
                  type="text" 
                  name="barbershopName"
                  placeholder="Barbearia Premium"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">WhatsApp</label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  placeholder="+351 912 345 678"
                  required
                  className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
              >
                {loading ? 'Criando sua conta...' : 'Começar Teste Grátis Agora 🚀'}
              </button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                ✅ Sem cartão de crédito • Cancele quando quiser
              </p>
            </form>
          </div>

          {/* Resumo do Teste */}
          <div className="space-y-6">
            
            {/* Card do Plano */}
            <div className="bg-gradient-to-br from-blue-500/10 to-black border-2 border-blue-500 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold">Teste Grátis - 7 Dias</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-blue-400 mb-2">€0<span className="text-lg text-zinc-400"> agora</span></p>
                <p className="text-sm text-zinc-400">€29/mês após o período de teste</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-center text-blue-400 font-bold mb-2">
                  🎉 SEM COMPROMISSO
                </p>
                <p className="text-center text-sm text-zinc-300">
                  Teste por <strong>7 dias grátis</strong>. Sem cartão de crédito. Cancele quando quiser.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Sistema completo de agendamento</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Lembretes automáticos WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Relatórios e análises completas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Suporte completo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-bold">Todos os recursos incluídos</span>
                </div>
              </div>
            </div>

            {/* Timeline do Teste */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Como Funciona o Teste</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-sm">Hoje</p>
                    <p className="text-sm text-zinc-400">Crie sua conta e comece a usar imediatamente</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500/50 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dias 1-7</p>
                    <p className="text-sm text-zinc-400">Use todos os recursos gratuitamente</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dia 7</p>
                    <p className="text-sm text-zinc-400">Decida se quer continuar por €29/mês ou cancelar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Garantias */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-green-400 mb-3">✅ Garantias do Teste Grátis</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li>✅ <strong>Sem cartão de crédito</strong> - não pedimos dados de pagamento</li>
                <li>✅ <strong>Cancele quando quiser</strong> - sem multas ou taxas</li>
                <li>✅ <strong>Acesso completo</strong> - todos os recursos liberados</li>
                <li>✅ <strong>Sem compromisso</strong> - teste sem obrigação</li>
                <li>✅ <strong>Suporte incluído</strong> - ajudamos você a começar</li>
              </ul>
            </div>

            {/* CTA Adicional */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
              <p className="text-sm text-blue-200 mb-3">
                💡 <strong>Dica:</strong> A maioria dos nossos clientes vê resultados nos primeiros 3 dias de uso!
              </p>
              <p className="text-xs text-zinc-500">
                Junte-se a 30+ barbearias em Portugal que já usam o BarberBook
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
