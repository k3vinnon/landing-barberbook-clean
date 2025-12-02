'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Check, Clock, MessageSquare, Sparkles } from 'lucide-react';

export default function UpsellIAPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleAccept = () => {
    // Redirecionar para WhatsApp do suporte
    const whatsappNumber = '351962518499'; // ← SEU NÚMERO!
    const message = encodeURIComponent('Oi! Acabei de assinar o BarberBook e quero saber mais sobre o Agente de IA humanizado para WhatsApp!');
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const handleDecline = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        
        {/* Countdown */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500 px-6 py-3 rounded-full">
            <Clock className="h-5 w-5 text-red-500" />
            <span className="text-red-500 font-bold">
              Oferta expira em {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700] rounded-3xl p-8 shadow-2xl shadow-[#FFD700]/20">
          
          {/* Título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center">
                <Bot className="h-10 w-10 text-black" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              🎉 Parabéns pela Assinatura!
            </h1>
            
            <div className="inline-block bg-[#FFD700]/20 border border-[#FFD700] px-4 py-2 rounded-full mb-6">
              <p className="text-[#FFD700] font-bold">
                ⚡ OFERTA EXCLUSIVA - Apenas para Novos Assinantes!
              </p>
            </div>
          </div>

          {/* Oferta */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Agente de IA <span className="text-[#FFD700]">Humanizado</span> para seu WhatsApp
            </h2>
            
            <p className="text-xl text-zinc-300 mb-6">
              Nunca mais perca um cliente! IA responde 24/7 como se fosse VOCÊ
            </p>
          </div>

          {/* Benefícios */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-white">100% Humanizado</p>
                <p className="text-sm text-zinc-400">Clientes NÃO percebem que é IA</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-white">Responde 24/7</p>
                <p className="text-sm text-zinc-400">Mesmo quando você está dormindo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-white">Agenda Automaticamente</p>
                <p className="text-sm text-zinc-400">Integrado com seu BarberBook</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-[#FFD700] flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-white">Customizado para Você</p>
                <p className="text-sm text-zinc-400">Aprende seu jeito de falar</p>
              </div>
            </div>
          </div>

          {/* Preço */}
          <div className="bg-black/50 border border-[#FFD700]/30 rounded-2xl p-6 mb-8 text-center">
            <p className="text-sm text-zinc-400 line-through mb-2">De: €497</p>
            <div className="mb-4">
              <span className="text-5xl font-bold text-[#FFD700]">€297</span>
              <span className="text-zinc-400 ml-2">pagamento único</span>
            </div>
            <p className="text-sm text-zinc-300">
              💳 Assinatura única • Sem mensalidade • Seu para sempre
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <button
              onClick={handleAccept}
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-6 w-6" />
              SIM! QUERO O AGENTE DE IA
            </button>
            
            <button
              onClick={handleDecline}
              className="w-full bg-transparent border-2 border-zinc-700 text-zinc-400 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-all"
            >
              Não, obrigado. Continuar para o Dashboard
            </button>
          </div>

          {/* Garantia */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            🔒 Esta oferta não estará disponível novamente
          </p>
        </div>

      </div>
    </div>
  );
}
