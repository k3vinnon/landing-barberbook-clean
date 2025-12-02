'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { User, Lock, Link as LinkIcon, Copy, Check } from 'lucide-react';

export default function SettingsPage() {
  const supabase = getSupabaseBrowserClient();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [bookingLink, setBookingLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: userData } = await supabase
      .from('users')
      .select('name, email')
      .eq('auth_id', user.id)
      .single();
    
    if (userData) {
      setProfile(userData);
      
      // Gerar link de agendamento
      const slug = userData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setBookingLink(`${window.location.origin}/agendar/${slug}`);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('As senhas não coincidem!');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });
      
      if (error) throw error;
      
      alert('Senha alterada com sucesso!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao alterar senha!');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-white">Configurações</h1>
      <p className="text-zinc-300 mb-8">Gerencie suas preferências e dados</p>

      {/* Dados do Perfil */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <User className="h-5 w-5 text-[#FFD700]" />
          Dados do Perfil
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nome</label>
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white opacity-60"
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Alterar Senha */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#FFD700]" />
          Alterar Senha
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Nova Senha</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              placeholder="Digite a nova senha"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-[#FFD700] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Confirmar Senha</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              placeholder="Confirme a nova senha"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-[#FFD700] focus:outline-none"
            />
          </div>
          
          <button
            onClick={handleChangePassword}
            disabled={!passwords.new || !passwords.confirm}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50"
          >
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Link de Agendamento */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-[#FFD700]" />
          Seu Link de Agendamento
        </h2>
        
        <p className="text-zinc-400 text-sm mb-4">
          Compartilhe este link com seus clientes para eles agendarem online
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={bookingLink}
            readOnly
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
          />
          <button
            onClick={copyLink}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-6 rounded-lg font-bold hover:scale-105 transition-all flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
