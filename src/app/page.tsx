"use client";

import { useState } from 'react';
import { Calendar, Scissors, Clock, TrendingUp, Check, Star } from 'lucide-react';

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

        {/* Testimonials Section */}
        <div className="mb-20 max-w-5xl mx-auto">
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

        {/* Pricing Section - APENAS 2 OPÇÕES */}
        <div className="mb-20 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Escolha seu <span className="text-[#FFD700]">plano</span>
          </h2>
          <p className="text-center text-zinc-400 mb-12 text-lg">
            Comece hoje e transforme sua barbearia
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Trial Plan */}
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-8 hover:border-[#FFD700] transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Teste Grátis</h3>
                <p className="text-zinc-400">Experimente sem compromisso</p>
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-[#FFD700] mb-2">€0</div>
                <p className="text-zinc-400">agora</p>
                <p className="text-sm text-zinc-500 mt-2">€29/mês depois do período de teste</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">7 dias grátis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Sem cartão de crédito</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Cancele quando quiser</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Todos os recursos incluídos</span>
                </li>
              </ul>

              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all">
                COMEÇAR TESTE GRÁTIS
              </button>
            </div>

            {/* Premium Plan - MAIS ESCOLHIDO */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700] rounded-3xl p-8 relative shadow-2xl shadow-[#FFD700]/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold px-6 py-2 rounded-full text-sm">
                MAIS ESCOLHIDO
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Começar por €14</h3>
                <p className="text-zinc-400">Economize €58 + Ganhe Bônus</p>
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-[#FFD700] mb-2">€14</div>
                <p className="text-zinc-400">hoje</p>
                <div className="mt-2 bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-3">
                  <p className="text-[#FFD700] font-bold">+ 2 MESES GRÁTIS (€58 de valor)</p>
                </div>
                <p className="text-sm text-zinc-500 mt-2 line-through">€29/mês depois</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">2 meses grátis (economize €58)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Template WhatsApp Profissional (€29)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Todos os recursos premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Suporte prioritário</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Configuração assistida</span>
                </li>
              </ul>

              <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold py-4 rounded-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/50">
                GARANTIR OFERTA AGORA
              </button>
            </div>
          </div>
        </div>

        {/* Trial Form */}
        <div className="max-w-md mx-auto bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700] p-8 rounded-3xl shadow-2xl shadow-[#FFD700]/20">
          <div className="text-center mb-6">
            <Scissors className="h-16 w-16 text-[#FFD700] mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Teste Grátis por 7 Dias</h2>
            <p className="text-zinc-400">Sem cartão de crédito. Cancele quando quiser.</p>
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
