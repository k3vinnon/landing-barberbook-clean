"use client";

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Calendar, Check, ArrowRight, Copy, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isPaid, setIsPaid] = useState(false);

  const sessionId = searchParams.get('session_id');
  const emailParam = searchParams.get('email');
  const passwordParam = searchParams.get('password');

  useEffect(() => {
    async function loadData() {
      // Se veio do Stripe (tem session_id)
      if (sessionId) {
        try {
          console.log('🔍 Buscando sessão do Stripe:', sessionId);
          
          // Buscar dados da sessão do Stripe
          const response = await fetch(`/api/get-session?session_id=${sessionId}`);
          const data = await response.json();
          
          console.log('📊 Dados recebidos:', data);
          
          if (data.success) {
            setIsPaid(true);
            setCredentials({
              email: data.email,
              password: data.password
            });
          } else {
            console.error('❌ Erro ao buscar sessão:', data.error);
          }
        } catch (error) {
          console.error('❌ Erro ao buscar session:', error);
        }
      } 
      // Se veio do teste grátis (tem email/password)
      else if (emailParam && passwordParam) {
        setIsPaid(false);
        setCredentials({
          email: emailParam,
          password: passwordParam
        });
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [sessionId, emailParam, passwordParam]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handleCopyCredentials = () => {
    const credentials = `Email: ${credentials.email}\nSenha: ${credentials.password}`;
    navigator.clipboard.writeText(credentials);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FFD700] mx-auto mb-4" />
          <p className="text-xl text-zinc-400">Processando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2">
            <Calendar className="h-6 w-6 text-black" />
            <span className="font-bold text-black text-xl">BarberBook</span>
          </div>
        </div>

        {/* Success Card */}
        <div className="rounded-3xl border-2 border-[#FFD700] bg-gradient-to-br from-zinc-900 to-black p-8 shadow-2xl shadow-[#FFD700]/20">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
              <Check className="h-10 w-10 text-black" />
            </div>
          </div>

          {/* Title - Diferente para pagos vs teste grátis */}
          <h1 className="mb-4 text-center text-4xl font-bold">
            {isPaid ? 'Pagamento Confirmado! 🎉' : 'Conta Criada com Sucesso! 🎉'}
          </h1>

          <p className="mb-8 text-center text-xl text-zinc-400">
            {isPaid 
              ? 'Bem-vindo ao BarberBook Premium!' 
              : 'Seu teste grátis de 7 dias está ativo!'}
          </p>

          {/* Warning Box */}
          <div className="mb-6 rounded-2xl border-2 border-red-500 bg-red-500/10 p-6">
            <p className="text-center text-lg font-bold text-red-500 mb-2">
              ⚠️ COPIE ESSAS CREDENCIAIS AGORA!
            </p>
            <p className="text-center text-sm text-red-400">
              Você precisará delas para fazer login. Anote em um lugar seguro!
            </p>
          </div>

          {/* Credentials Box */}
          <div className="mb-8 rounded-2xl border border-[#FFD700]/30 bg-black/50 p-6">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-[#FFD700]">
              Suas Credenciais de Acesso
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-zinc-500">Email de Acesso:</label>
                <div className="rounded-lg bg-zinc-800 p-3 font-mono text-[#FFD700] break-all">
                  {credentials.email || 'Não disponível'}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-500">Senha Temporária:</label>
                <div className="rounded-lg bg-zinc-800 p-3 font-mono text-[#FFD700]">
                  {credentials.password || 'Não disponível'}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyCredentials}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 p-3 text-sm text-zinc-300 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copiar Credenciais
            </button>

            <p className="mt-4 text-center text-xs text-zinc-500">
              💡 Recomendamos alterar sua senha após o primeiro login
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoToLogin}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/50"
            >
              Ir para Login
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Next Steps */}
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-4 font-bold text-[#FFD700]">Próximos Passos:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                <span>Faça login com as credenciais acima</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                <span>Configure sua barbearia no dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                <span>Adicione seus serviços e horários de atendimento</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FFD700]" />
                <span>Comece a receber agendamentos automaticamente</span>
              </li>
            </ul>
          </div>

          {/* Badge para clientes pagos */}
          {isPaid && (
            <div className="mt-6 rounded-xl border-2 border-[#FFD700] bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 p-4">
              <p className="text-center text-sm font-bold text-[#FFD700]">
                ✨ Você é um membro PREMIUM do BarberBook!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-zinc-600">
          Precisa de ajuda? Entre em contato com nosso suporte
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#FFD700]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
