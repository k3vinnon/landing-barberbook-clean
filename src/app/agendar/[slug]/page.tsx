'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Funções helper para o calendário
function getNext14Days() {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
  }
  
  return days;
}

function getDayName(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { weekday: 'short' });
}

function getDay(dateStr: string) {
  const date = new Date(dateStr);
  return date.getDate();
}

// Funções helper para horários
function getAvailableTimeSlots() {
  const slots = [];
  const startHour = 9; // 09:00
  const endHour = 19; // 19:00
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  return slots;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const [barber, setBarber] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState(1);
  
  useEffect(() => {
    loadBarberData();
  }, []);

  const loadBarberData = async () => {
    // Buscar TODOS os usuários primeiro
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email');

    console.log('👥 Todos os usuários:', allUsers);

    if (!allUsers || allUsers.length === 0) {
      console.error('❌ Nenhum usuário encontrado!');
      return;
    }

    // Buscar localmente pelo slug
    const searchTerms = params.slug.toLowerCase().split('-');
    console.log('🔍 Termos de busca:', searchTerms);

    const foundBarber = allUsers.find(u => {
      const userName = u.name.toLowerCase();
      return searchTerms.every(term => userName.includes(term));
    });

    console.log('✅ Barbeiro encontrado:', foundBarber);

    if (!foundBarber) {
      console.error('❌ Barbeiro não encontrado com slug:', params.slug);
      return;
    }

    setBarber(foundBarber);

    // Agora buscar serviços
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', foundBarber.id)
      .eq('active', true);

    console.log('✅ Serviços:', servicesData);
    setServices(servicesData || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <Calendar className="h-12 w-12 text-[#FFD700]" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Agendar com {barber?.name || 'Carregando...'}
          </h1>
          <p className="text-zinc-400">
            {step === 1 && 'Escolha um serviço para continuar'}
            {step === 2 && 'Escolha a data do agendamento'}
            {step === 3 && 'Escolha o horário disponível'}
          </p>
        </div>

        {/* ETAPA 1 - Lista de Serviços */}
        {step === 1 && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedService?.id === service.id
                      ? 'border-[#FFD700] bg-zinc-800'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{service.icon || '✂️'}</div>
                  <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-zinc-400 mb-3">{service.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#FFD700] font-bold text-lg">€{service.price}</span>
                    <span className="text-zinc-500 text-sm">{service.duration} min</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Botão Continuar */}
            {selectedService && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all"
                >
                  Continuar →
                </button>
              </div>
            )}
          </>
        )}

        {/* ETAPA 2 - Calendário */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Escolha a Data</h2>
            
            {/* Calendário Simples */}
            <div className="grid grid-cols-7 gap-2">
              {/* Próximos 14 dias */}
              {getNext14Days().map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setStep(3); // Próxima etapa
                  }}
                  className="p-4 rounded-lg border-2 border-zinc-800 hover:border-[#FFD700] transition-all"
                >
                  <div className="text-sm text-zinc-400">{getDayName(date)}</div>
                  <div className="font-bold">{getDay(date)}</div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setStep(1)}
              className="text-zinc-400 hover:text-white"
            >
              ← Voltar
            </button>
          </div>
        )}

        {/* ETAPA 3 - Escolher Horário */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Escolha o Horário</h2>
              <p className="text-zinc-400">
                {selectedService?.name} • {formatDate(selectedDate)}
              </p>
            </div>
            
            {/* Grid de Horários */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {getAvailableTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setStep(4); // Próxima etapa
                  }}
                  className="p-4 rounded-lg border-2 border-zinc-800 hover:border-[#FFD700] transition-all text-center"
                >
                  <div className="font-bold">{time}</div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setStep(2)}
              className="text-zinc-400 hover:text-white"
            >
              ← Voltar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
