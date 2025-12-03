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
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

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
    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select('*')
      .eq('barber_id', userData.id);
    
    // Buscar TODOS os serviços (para pegar preços)
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userData.id);
    
    setAppointments(appointmentsData || []);
    setServices(servicesData || []);
    
    // CALCULAR ESTATÍSTICAS
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const appointmentsToday = appointmentsData?.filter(a => a.date === today).length || 0;
    const appointmentsWeek = appointmentsData?.filter(a => a.date >= weekAgo).length || 0;
    const appointmentsMonth = appointmentsData?.filter(a => a.date >= monthAgo).length || 0;
    
    // Taxa de comparecimento
    const confirmed = appointmentsData?.filter(a => a.status === 'confirmed').length || 0;
    const total = appointmentsData?.length || 1;
    const attendanceRate = Math.round((confirmed / total) * 100);
    
    // Faturamento (soma de preços dos serviços agendados confirmados)
    let totalRevenue = 0;
    appointmentsData?.forEach(apt => {
      if (apt.status === 'confirmed') {
        const service = servicesData?.find(s => s.name === apt.service);
        if (service) {
          totalRevenue += parseFloat(service.price);
        }
      }
    });
    
    // Clientes únicos
    const uniqueClients = new Set(appointmentsData?.map(a => a.client_whatsapp));
    
    setStats({
      totalRevenue,
      appointmentsToday,
      appointmentsWeek,
      appointmentsMonth,
      attendanceRate,
      totalClients: uniqueClients.size,
      topServices: [],
      topClients: []
    });
  };

  const getLast7DaysRevenue = () => {
    const last7Days = [];
    const servicesMap = new Map(services?.map(s => [s.name, s.price]) || []);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = appointments?.filter(a => 
        a.date === dateStr && a.status === 'confirmed'
      ) || [];
      
      const revenue = dayAppointments.reduce((sum, apt) => {
        const price = servicesMap.get(apt.service) || 0;
        return sum + parseFloat(price);
      }, 0);
      
      last7Days.push({
        date: dateStr,
        label: date.toLocaleDateString('pt-PT', { weekday: 'short' }),
        revenue: revenue,
        percentage: 0 // calcular depois
      });
    }
    
    // Calcular porcentagens
    const maxRevenue = Math.max(...last7Days.map(d => d.revenue), 1);
    last7Days.forEach(day => {
      day.percentage = (day.revenue / maxRevenue) * 100;
    });
    
    return last7Days;
  };

  const getTopServices = () => {
    const servicesCount = new Map();
    const servicesMap = new Map(services?.map(s => [s.name, s.price]) || []);
    
    appointments?.forEach(apt => {
      if (apt.status === 'confirmed') {
        const current = servicesCount.get(apt.service) || { count: 0, revenue: 0 };
        const price = servicesMap.get(apt.service) || 0;
        
        servicesCount.set(apt.service, {
          count: current.count + 1,
          revenue: current.revenue + parseFloat(price)
        });
      }
    });
    
    const topServices = Array.from(servicesCount.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: 0
    }));
    
    // Calcular porcentagens
    const maxCount = Math.max(...topServices.map(s => s.count), 1);
    topServices.forEach(s => {
      s.percentage = (s.count / maxCount) * 100;
    });
    
    // Ordenar por quantidade
    return topServices.sort((a, b) => b.count - a.count).slice(0, 5);
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

      {/* Faturamento dos Últimos 7 Dias */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#FFD700]" />
          Faturamento dos Últimos 7 Dias
        </h2>
        
        <div className="space-y-3">
          {getLast7DaysRevenue().map((day) => (
            <div key={day.date} className="flex items-center gap-3">
              <span className="text-sm text-zinc-400 w-24">{day.label}</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] h-full rounded-full transition-all"
                  style={{ width: `${day.percentage}%` }}
                />
                <span className="absolute right-3 top-1 text-sm font-bold text-black">
                  €{day.revenue.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Serviços Mais Vendidos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-[#FFD700]" />
          Serviços Mais Vendidos
        </h2>
        
        <div className="space-y-3">
          {getTopServices().map((service, index) => (
            <div key={service.name} className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#FFD700] w-8">{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{service.name}</span>
                  <span className="text-sm text-zinc-400">{service.count} agendamentos</span>
                </div>
                <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#FFD700] h-full rounded-full"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-lg font-bold text-[#FFD700]">€{service.revenue.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativo */}
      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-bold mb-4 text-white">📈 Crescimento</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Este mês:</span>
              <span className="font-bold text-white">{stats.appointmentsMonth} agendamentos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Esta semana:</span>
              <span className="font-bold text-white">{stats.appointmentsWeek} agendamentos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Hoje:</span>
              <span className="font-bold text-white">{stats.appointmentsToday} agendamentos</span>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-bold mb-4 text-white">💶 Receita</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Total confirmado:</span>
              <span className="font-bold text-[#FFD700]">€{stats.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Ticket médio:</span>
              <span className="font-bold text-white">
                €{stats.totalRevenue > 0 ? (stats.totalRevenue / appointments?.filter(a => a.status === 'confirmed').length).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total de clientes:</span>
              <span className="font-bold text-white">{stats.totalClients}</span>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  );
}
