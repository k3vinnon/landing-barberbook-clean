'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, MessageSquare, BarChart3, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Pegar session_id da URL
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    setSessionId(session);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header de Sucesso */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pagamento Confirmado! 🎉</h1>
            <p className="text-xl text-zinc-300 mb-6">
              Bem-vindo ao BarberBook! Sua conta foi criada com sucesso.
            </p>
            {sessionId && (
              <p className="text-sm text-zinc-500">
                ID da Sessão: {sessionId}
              </p>
            )}
          </div>

          {/* Próximos Passos */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Card Principal */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">🚀 Próximos Passos</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Acesse seu Dashboard</h3>
                    <p className="text-sm text-zinc-400 mb-3">
                      Faça login na plataforma e configure sua barbearia
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#FFA500] transition-all"
                    >
                      Ir para Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Configure seus Serviços</h3>
                    <p className="text-sm text-zinc-400">
                      Adicione os serviços que você oferece e seus preços
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Comece a Agendar</h3>
                    <p className="text-sm text-zinc-400">
                      Compartilhe seu link de agendamento com os clientes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recursos Disponíveis */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">✨ Recursos Liberados</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-[#FFD700]" />
                  <span className="text-sm">Sistema de agendamento online</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-[#FFD700]" />
                  <span className="text-sm">Lembretes automáticos WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-[#FFD700]" />
                  <span className="text-sm">Relatórios e análises completas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#FFD700]" />
                  <span className="text-sm">Gestão de clientes</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl">
                <p className="text-sm text-center text-zinc-300">
                  🎯 <strong>Meta:</strong> Faça €1000 em agendamentos nos primeiros 30 dias para manter a garantia!
                </p>
              </div>
            </div>

          </div>

          {/* Suporte */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Precisa de Ajuda?</h3>
            <p className="text-blue-200 mb-6">
              Nossa equipe está aqui para te ajudar a começar. Entre em contato conosco!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/351912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                <MessageSquare className="h-5 w-5" />
                WhatsApp Suporte
              </a>
              <a
                href="mailto:suporte@barberbook.club"
                className="inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                📧 E-mail Suporte
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-zinc-500 mb-4">
              Obrigado por escolher o BarberBook! Transforme seu negócio hoje mesmo.
            </p>
            <Link
              href="/"
              className="text-[#FFD700] hover:text-[#FFA500] transition-all"
            >
              ← Voltar para página inicial
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}