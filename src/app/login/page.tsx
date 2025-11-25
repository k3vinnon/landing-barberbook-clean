'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log('🔐 Tentando login com:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('📝 Resposta do login:', { data, error });
      
      if (error) {
        console.error('❌ Erro:', error.message);
        setError('Email ou senha incorretos!');
        setLoading(false);
        return;
      }
      
      console.log('✅ Login bem-sucedido! Redirecionando...');
      router.push('/dashboard');
      
    } catch (err) {
      console.error('❌ Erro ao fazer login:', err);
      setError('Erro ao fazer login!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2">
            <Calendar className="h-6 w-6 text-black" />
            <span className="font-bold text-black text-xl">BarberBook</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border-2 border-zinc-800 bg-zinc-900 p-8">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Fazer Login
          </h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg bg-zinc-800 p-3 text-white border border-zinc-700 focus:border-[#FFD700] focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-400">Senha</label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-lg bg-zinc-800 p-3 text-white border border-zinc-700 focus:border-[#FFD700] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-3 font-bold text-black transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Não tem conta?{' '}
            <a href="/" className="text-[#FFD700] hover:underline">
              Criar teste grátis
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
