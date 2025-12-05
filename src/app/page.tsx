"use client";

import { useState } from 'react';
import { Calendar, Scissors, Clock, TrendingUp, Check, Star, Shield, Zap } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      barbershopName: formData.get('barbershopName') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string
    };
    
    try {
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      // Se o servidor retornar um redirect, seguir manualmente
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      
      // Se não houver redirect, verificar resposta JSON
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
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-3">
            <Calendar className="h-8 w-8 text-black" />
            <span className="font-bold text-black text-2xl">BarberBook</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
          Transforme Sua Barbearia
        </h1>
        <p className="text-xl md:text-2xl text-center mb-16 text-zinc-400 max-w-3xl mx-auto">
          Sistema completo de agendamento online. Mais clientes, menos trabalho manual.
        </p>

        {/* Stats Section */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-red-400">
              ⚠️ Você está perdendo dinheiro todos os dias
            </h2>
            <p className="text-center text-lg text-zinc-300 mb-6">
              Barbearias sem sistema de agendamento perdem entre <span className="font-bold text-[#FFD700]">€500 - €800/mês</span> em faturamento por:
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-black/50 rounded-xl p-4">
                <p className="text-3xl font-bold text-red-400 mb-2">30%</p>
                <p className="text-sm text-zinc-400">Clientes que não conseguem agendar</p>
              </div>
              <div className="bg-black/50 rounded-xl p-4">
                <p className="text-3xl font-bold text-red-400 mb-2">25%</p>
                <p className="text-sm text-zinc-400">Faltas sem confirmação</p>
              </div>
              <div className="bg-black/50 rounded-xl p-4">
                <p className="text-3xl font-bold text-red-400 mb-2">3h/dia</p>
                <p className="text-sm text-zinc-400">Perdidas com ligações</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#FFD700] transition-all">
            <Calendar className="h-12 w-12 text-[#FFD700] mb-4" />
            <h3 className="text-xl font-bold mb-2">Agendamento 24/7</h3>
            <p className="text-zinc-400">Clientes agendam a qualquer hora, sem precisar ligar</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#FFD700] transition-all">
            <Clock className="h-12 w-12 text-[#FFD700] mb-4" />
            <h3 className="text-xl font-bold mb-2">Gestão de Horários</h3>
            <p className="text-zinc-400">Controle total da sua agenda em um só lugar</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#FFD700] transition-all">
            <TrendingUp className="h-12 w-12 text-[#FFD700] mb-4" />
            <h3 className="text-xl font-bold mb-2">Aumente o Faturamento</h3>
            <p className="text-zinc-400">Reduza faltas e otimize seu tempo</p>
          </div>
        </div>

        {/* NEW PRICING SECTION - 3 OPTIONS (HORMOZI STYLE) */}
        <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Escolha Seu Plano
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                3 formas de começar. Escolha a que faz mais sentido para você.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* OPÇÃO 1: WIN YOUR MONEY BACK */}
              <div className="rounded-3xl border-2 border-green-500 bg-gradient-to-br from-green-500/10 to-black p-8 hover:scale-105 transition-all">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <Shield className="h-4 w-4" />
                    ZERO RISCO
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Experimente Com Garantia Total</h3>
                  <p className="text-zinc-400 mb-4">Win Your Money Back</p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-green-400">€29</span>
                    <span className="text-zinc-400 ml-2">/mês</span>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                  <p className="text-center text-green-400 font-bold mb-2">
                    💰 GARANTIA HORMOZI
                  </p>
                  <p className="text-center text-sm text-zinc-300">
                    Se não fizer <strong>€1000 em agendamentos</strong> em 30 dias, devolvemos seu €29!
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">Sistema completo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">Lembretes WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">Relatórios completos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-bold">Zero risco!</span>
                  </div>
                </div>

                <a 
                  href="/checkout/monthly"
                  className="block w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-all hover:scale-105 text-center"
                >
                  COMEÇAR AGORA
                </a>
              </div>

              {/* OPÇÃO 2: PAGUE MENOS AGORA (ANUAL) - MAIS ESCOLHIDO */}
              <div className="rounded-3xl border-2 border-[#FFD700] bg-gradient-to-br from-zinc-900 to-black p-8 relative hover:scale-105 transition-all shadow-2xl shadow-[#FFD700]/20">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#FFD700] text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Star className="h-4 w-4 fill-black" />
                    MAIS ESCOLHIDO
                  </span>
                </div>

                <div className="text-center mb-6 mt-4">
                  <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 text-[#FFD700] px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <Zap className="h-4 w-4" />
                    MELHOR OFERTA
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Economize €108 + Sem Compromisso Mensal</h3>
                  <p className="text-zinc-400 mb-4">Pague 1x e esqueça</p>
                  
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-[#FFD700]">€240</span>
                    <span className="text-zinc-400 ml-2">/ano</span>
                  </div>
                  <p className="text-sm text-zinc-500 line-through">€348/ano (€29/mês)</p>
                  <p className="text-lg font-bold text-green-400 mt-2">20% de desconto</p>
                </div>

                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300">✅ Economize:</span>
                      <span className="font-bold text-[#FFD700]">€108/ano</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300">✅ Pague 1x:</span>
                      <span className="font-bold text-white">Sem mensalidades</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300">✅ Churn:</span>
                      <span className="font-bold text-green-400">5x menor</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                    <span className="text-sm">Tudo do plano mensal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                    <span className="text-sm font-bold">Prioridade no suporte</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                    <span className="text-sm font-bold">Acesso a novos recursos primeiro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                    <span className="text-sm">Sem preocupação com renovação</span>
                  </div>
                </div>

                <a 
                  href="/checkout/annual"
                  className="block w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-center"
                >
                  GARANTIR ANUAL AGORA
                </a>
              </div>

              {/* OPÇÃO 3: TESTE GRÁTIS 7 DIAS */}
              <div className="rounded-3xl border-2 border-zinc-800 bg-zinc-900 p-8 hover:border-blue-500 transition-all">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <Calendar className="h-4 w-4" />
                    SEM COMPROMISSO
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Teste Grátis 7 Dias</h3>
                  <p className="text-zinc-400 mb-4">Experimente sem pagar nada</p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-blue-400">€0</span>
                    <span className="text-zinc-400 ml-2">agora</span>
                  </div>
                  <p className="text-sm text-zinc-500">€29/mês depois do teste</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">7 dias grátis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">Sem cartão de crédito</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">Cancele quando quiser</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">Todos os recursos incluídos</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const form = document.getElementById('trial-form');
                    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all"
                >
                  COMEÇAR TESTE GRÁTIS
                </button>
              </div>

            </div>

            {/* Trust Badge */}
            <div className="text-center mt-12">
              <p className="text-zinc-500 text-sm">
                ✅ Cancelamento gratuito a qualquer momento • 🔒 Pagamento 100% seguro • 🇵🇹 Suporte em português
              </p>
            </div>
          </div>
        </section>

        {/* Trial Form - ÚNICO FORMULÁRIO DA PÁGINA */}
        <div id="trial-form" className="max-w-md mx-auto bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700] p-8 rounded-3xl shadow-2xl shadow-[#FFD700]/20 mt-20">
          <div className="text-center mb-6">
            <Scissors className="h-16 w-16 text-[#FFD700] mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Comece Seu Teste Grátis</h2>
            <p className="text-zinc-400">Preencha os dados abaixo para começar</p>
          </div>

          <form onSubmit={handleTrialSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                name="name"
                placeholder="Seu Nome Completo"
                required
                className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
              />
            </div>

            <div>
              <input 
                type="text" 
                name="barbershopName"
                placeholder="Nome da Barbearia"
                required
                className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
              />
            </div>

            <div>
              <input 
                type="email" 
                name="email"
                placeholder="Seu E-mail"
                required
                className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
              />
            </div>

            <div>
              <input 
                type="tel" 
                name="whatsapp"
                placeholder="WhatsApp (com código do país)"
                required
                className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#FFD700] focus:outline-none transition-all"
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
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] p-4 rounded-xl font-bold text-black text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Criando sua conta...' : 'Começar Teste Grátis Agora 🚀'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Ao criar sua conta, você concorda com nossos Termos de Uso
          </p>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20 max-w-5xl mx-auto mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que dizem os <span className="text-[#FFD700]">barbeiros</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-[#FFD700] transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 text-lg">
                "Ganhei 3h por dia com BarberBook. Vale cada cêntimo! Os meus clientes adoram poder agendar a qualquer hora."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black font-bold">
                  CA
                </div>
                <div>
                  <p className="font-bold">Carlos Alves</p>
                  <p className="text-sm text-zinc-500">Barbeiro • Lisboa</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-[#FFD700] transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 text-lg">
                "Clientes não esquecem mais. Show-rate subiu de 80% para 95%. Faturamento aumentou €600/mês!"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-black font-bold">
                  JC
                </div>
                <div>
                  <p className="font-bold">João Costa</p>
                  <p className="text-sm text-zinc-500">Barbeiro • Porto</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-zinc-500 mb-4">Junte-se às barbearias que já usam o BarberBook em Portugal</p>
          <div className="flex justify-center gap-8 text-zinc-400">
            <div>
              <p className="text-3xl font-bold text-[#FFD700]">30+</p>
              <p className="text-sm">Barbearias em Portugal</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FFD700]">40%</p>
              <p className="text-sm">Aumento no faturamento</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FFD700]">4.9★</p>
              <p className="text-sm">Avaliação</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
