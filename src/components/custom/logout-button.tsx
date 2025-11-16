'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem('barber_id');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50"
    >
      <LogOut className="h-5 w-5" />
      <span className="hidden sm:inline">{loading ? 'Saindo...' : 'Sair'}</span>
    </button>
  );
}
