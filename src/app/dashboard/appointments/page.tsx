'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Calendar, Clock, User, Phone, Check, X, AlertCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const supabase = getSupabaseBrowserClient();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [barberId, setBarberId] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();
      
      if (!userData) return;
      
      setBarberId(userData.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('barber_id', userData.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      
      if (error) {
        console.error('Erro:', error);
        return;
      }
      
      console.log('✅ Agendamentos:', data);
      setAppointments(data || []);
      
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysStr = next7Days.toISOString().split('T')[0];
    
    return appointments.filter(apt => apt.date > today && apt.date <= next7DaysStr);
  };

  const handleConfirm = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', id);
      
      if (error) throw error;
      
      alert('Agendamento confirmado!');
      loadAppointments();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao confirmar!');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar?')) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      alert('Agendamento cancelado!');
      loadAppointments();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cancelar!');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-zinc-400">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meus Agendamentos</h1>
        <p className="text-zinc-400">Gerencie seus horários e clientes</p>
      </div>
      
      {/* Agendamentos de Hoje */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6 text-[#FFD700]" />
          <h2 className="text-xl font-bold">Hoje ({new Date().toLocaleDateString('pt-PT')})</h2>
        </div>
        
        {getTodayAppointments().length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">Nenhum agendamento para hoje</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getTodayAppointments().map((apt) => (
              <div key={apt.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-[#FFD700]/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-[#FFD700]" />
                      <span className="font-bold text-lg">{apt.time}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                        apt.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {apt.status === 'confirmed' ? 'Confirmado' : 
                         apt.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-zinc-400">
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-white">{apt.client_name}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a 
                          href={`https://wa.me/${apt.client_whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FFD700] transition-colors"
                        >
                          {apt.client_whatsapp}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>✂️</span>
                        <span>{apt.service}</span>
                      </p>
                    </div>
                  </div>
                  
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(apt.id)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all"
                        title="Confirmar agendamento"
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                        title="Cancelar agendamento"
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Próximos Agendamentos */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6 text-[#FFD700]" />
          <h2 className="text-xl font-bold">Próximos 7 Dias</h2>
        </div>
        
        {getUpcomingAppointments().length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">Nenhum agendamento nos próximos 7 dias</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getUpcomingAppointments().map((apt) => (
              <div key={apt.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-[#FFD700]/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-[#FFD700]" />
                      <span className="font-bold text-lg">{apt.time}</span>
                      <span className="text-sm text-zinc-400">• {formatDate(apt.date)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                        apt.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {apt.status === 'confirmed' ? 'Confirmado' : 
                         apt.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-zinc-400">
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-white">{apt.client_name}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a 
                          href={`https://wa.me/${apt.client_whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FFD700] transition-colors"
                        >
                          {apt.client_whatsapp}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>✂️</span>
                        <span>{apt.service}</span>
                      </p>
                    </div>
                  </div>
                  
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(apt.id)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all"
                        title="Confirmar agendamento"
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                        title="Cancelar agendamento"
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
