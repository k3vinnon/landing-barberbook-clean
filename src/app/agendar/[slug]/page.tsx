'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Check } from 'lucide-react';

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
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
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

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    
    try {
      console.log('📝 Criando agendamento...');
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          barber_id: barber.id,
          service_id: selectedService.id,
          client_name: clientData.name,
          client_phone: clientData.phone,
          client_email: clientData.email || null,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro:', error);
        alert('Erro ao criar agendamento. Tente novamente!');
        return;
      }
      
      console.log('✅ Agendamento criado:', data);
      
      // Mostrar confirmação
      setBookingConfirmed(true);
      
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('Erro ao criar agendamento!');
    } finally {
      setSubmitting(false);
    }
  };

  // Se agendamento confirmado, mostrar tela de sucesso
  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold">Agendamento Confirmado! 🎉</h2>
            
            <p className="text-zinc-400">
              Seu horário foi reservado com sucesso!<br/>
              Em breve você receberá uma confirmação no WhatsApp.
            </p>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left">
              <h3 className="font-bold mb-3">Detalhes do Agendamento:</h3>
              <div className="space-y-2 text-sm">
                <p>✂️ <strong>{selectedService?.name}</strong></p>
                <p>📅 {formatDate(selectedDate)}</p>
                <p>🕐 {selectedTime}</p>
                <p>💶 €{selectedService?.price}</p>
                <p>👤 {clientData.name}</p>
                <p>📱 {clientData.phone}</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all"
            >
              Fazer Novo Agendamento
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {step === 4 && 'Confirme seus dados'}
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

        {/* ETAPA 4 - Dados do Cliente e Confirmação */}
        {step === 4 && (
          <div className="space-y-6">
            
            {/* Resumo do Agendamento */}
            <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Confirme seu Agendamento</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Serviço:</span>
                  <span className="font-bold">{selectedService?.icon} {selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Data:</span>
                  <span className="font-bold">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Horário:</span>
                  <span className="font-bold">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Duração:</span>
                  <span className="font-bold">{selectedService?.duration} minutos</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-3 mt-3">
                  <span className="text-zinc-400">Valor:</span>
                  <span className="font-bold text-[#FFD700] text-xl">€{selectedService?.price}</span>
                </div>
              </div>
            </div>

            {/* Formulário de Dados */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold mb-4">Seus Dados</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({...clientData, name: e.target.value})}
                    placeholder="Seu nome"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-[#FFD700] focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">WhatsApp *</label>
                  <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-[#FFD700] focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Email (opcional)</label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    placeholder="seu@email.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold transition-all"
              >
                ← Voltar
              </button>
              
              <button
                onClick={handleConfirmBooking}
                disabled={!clientData.name || !clientData.phone || submitting}
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-3 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
