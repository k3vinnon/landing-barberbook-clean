"use client";

import { useState } from 'react';
import { Calendar, Scissors, Clock, TrendingUp } from 'lucide-react';

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
                placeholder="WhatsApp (com DDD)"
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
          <p className="text-zinc-500 mb-4">Junte-se a centenas de barbearias que já usam o BarberBook</p>
          <div className="flex justify-center gap-8 text-zinc-400">
            <div>
              <p className="text-3xl font-bold text-[#FFD700]">500+</p>
              <p className="text-sm">Barbearias</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#FFD700]">10k+</p>
              <p className="text-sm">Agendamentos/mês</p>
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
