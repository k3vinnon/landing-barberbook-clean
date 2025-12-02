'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Users, Search, Calendar, Phone, Mail } from 'lucide-react';

export default function ClientsPage() {
  const supabase = getSupabaseBrowserClient();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
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
      
      // Agrupar por cliente (únicos)
      const clientsMap = new Map();
      
      appointments?.forEach(apt => {
        const key = apt.client_whatsapp;
        
        if (!clientsMap.has(key)) {
          clientsMap.set(key, {
            name: apt.client_name,
            phone: apt.client_whatsapp,
            email: apt.client_email,
            appointments: [],
            totalSpent: 0
          });
        }
        
        const client = clientsMap.get(key);
        client.appointments.push(apt);
      });
      
      setClients(Array.from(clientsMap.values()));
      
      console.log('✅ Clientes carregados:', clientsMap.size);
      
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Meus Clientes</h1>
        <p className="text-zinc-300">Gerencie seus clientes e histórico de agendamentos</p>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#FFD700] focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-[#FFD700] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-lg">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white">{client.name}</h3>
                  <p className="text-sm text-zinc-400">{client.appointments.length} agendamento(s)</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-zinc-300">
                <Phone className="h-4 w-4 text-[#FFD700]" />
                {client.phone}
              </p>
              {client.email && (
                <p className="flex items-center gap-2 text-zinc-300">
                  <Mail className="h-4 w-4 text-[#FFD700]" />
                  {client.email}
                </p>
              )}
              <p className="flex items-center gap-2 text-zinc-300">
                <Calendar className="h-4 w-4 text-[#FFD700]" />
                Último: {new Date(client.appointments[client.appointments.length - 1].date).toLocaleDateString('pt-PT')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && !loading && (
        <div className="text-center py-12 text-zinc-400">
          {searchTerm ? 'Nenhum cliente encontrado' : 'Ainda não tem clientes'}
        </div>
      )}
    </div>
  );
}
