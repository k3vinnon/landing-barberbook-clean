'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Calendar, LayoutDashboard, Settings, Users, Wrench, LogOut, Menu, X, MessageSquare } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseBrowserClient();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('name')
      .eq('auth_id', user.id)
      .single();

    if (userData) {
      setUserName(userData.name || 'Barbeiro');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { 
      href: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Início',
      active: pathname === '/dashboard'
    },
    { 
      href: '/dashboard/services', 
      icon: Wrench, 
      label: 'Serviços',
      active: pathname === '/dashboard/services'
    },
    { 
      href: '/dashboard/appointments', 
      icon: Calendar, 
      label: 'Agendamentos',
      active: pathname === '/dashboard/appointments'
    },
    {
      href: '/dashboard/messages',
      icon: MessageSquare,
      label: 'Mensagens',
      active: pathname === '/dashboard/messages'
    },
    { 
      href: '/dashboard/clients', 
      icon: Users, 
      label: 'Clientes',
      active: pathname === '/dashboard/clients'
    },
    { 
      href: '/dashboard/settings', 
      icon: Settings, 
      label: 'Configurações',
      active: pathname === '/dashboard/settings'
    },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      
      {/* Sidebar Lateral Fixa */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col`}>
        
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-[#FFD700]" />
              <span className="font-bold text-white text-lg">BarberBook</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-all"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-zinc-400" />
            ) : (
              <Menu className="h-5 w-5 text-zinc-400" />
            )}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{userName}</p>
                <p className="text-xs text-zinc-400">Barbeiro</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-[#FFD700] text-black font-bold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all w-full ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  );
}
