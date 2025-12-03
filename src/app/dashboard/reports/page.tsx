'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { TrendingUp, Calendar, Users, Euro, Award } from 'lucide-react';

export default function ReportsPage() {
  const supabase = getSupabaseBrowserClient();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    appointmentsToday: 0,
    appointmentsWeek: 0,
    appointmentsMonth: 0,
    attendanceRate: 0,
    totalClients: 0,
    topServices: [],
    topClients: []
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();
    
    if (!userData) return;
    
    // Buscar TODOS os agendamentos
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('barber_id', userData.id);
    
    // Buscar TODOS os serviços (para pegar preços)
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userData.id);
    
    // CALCULAR ESTATÍSTICAS
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const appointmentsToday = appointments?.filter(a => a.date === today).length || 0;
    const appointmentsWeek = appointments?.filter(a => a.date >= weekAgo).length || 0;
    const appointmentsMonth = appointments?.filter(a => a.date >= monthAgo).length || 0;
    
    // Taxa de comparecimento
    const confirmed = appointments?.filter(a => a.status === 'confirmed').length || 0;
    const total = appointments?.length || 1;
    const attendanceRate = Math.round((confirmed / total) * 100);
    
    // Faturamento (soma de preços dos serviços agendados confirmados)
    let totalRevenue = 0;
    appointments?.forEach(apt => {
      if (apt.status === 'confirmed') {
        const service = services?.find(s => s.name === apt.service);
        if (service) {
          totalRevenue += parseFloat(service.price);
        }
      }
    });
    
    // Clientes únicos
    const uniqueClients = new Set(appointments?.map(a => a.client_whatsapp));
    
    setStats({
      totalRevenue,
      appointmentsToday,
      appointmentsWeek,
      appointmentsMonth,
      attendanceRate,
      totalClients: uniqueClients.size,
      topServices: [], // TODO
      topClients: [] // TODO
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-white">Relatórios</h1>
      <p className="text-zinc-300 mb-8">Análise completa do seu negócio</p>

      {/* Cards de Estatísticas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Faturamento */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Euro className="h-5 w-5 text-[#FFD700]" />
            <span className="text-sm text-zinc-400">Faturamento Total</span>
          </div>
          <p className="text-3xl font-bold text-white">€{stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-zinc-500 mt-1">Agendamentos confirmados</p>
        </div>

        {/* Agendamentos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-[#FFD700]" />
            <span className="text-sm text-zinc-400">Agendamentos</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.appointmentsMonth}</p>
          <p className="text-xs text-zinc-500 mt-1">
            Hoje: {stats.appointmentsToday} • Semana: {stats.appointmentsWeek}
          </p>
        </div>

        {/* Taxa de Comparecimento */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-[#FFD700]" />
            <span className="text-sm text-zinc-400">Comparecimento</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.attendanceRate}%</p>
          <p className="text-xs text-zinc-500 mt-1">Taxa de confirmação</p>
        </div>

        {/* Clientes */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-[#FFD700]" />
            <span className="text-sm text-zinc-400">Clientes Únicos</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
          <p className="text-xs text-zinc-500 mt-1">Total cadastrados</p>
        </div>

      </div>

      {/* Placeholder para gráficos futuros */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <p className="text-zinc-400">📊 Gráficos e análises detalhadas em breve!</p>
      </div>

    </div>
  );
}
