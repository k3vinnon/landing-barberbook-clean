'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage({ params }: { params: { slug: string } }) {
  const [barber, setBarber] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  useEffect(() => {
    loadBarberData();
  }, []);

  const loadBarberData = async () => {
    const slug = params.slug;
    
    // Buscar barbeiro
    const { data: userData } = await supabase
      .from('users')
      .select('id, name, email')
      .ilike('name', `%${slug.replace(/-/g, ' ')}%`)
      .single();
    
    if (userData) {
      setBarber(userData);
      
      // Buscar serviços
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userData.id)
        .eq('active', true);
      
      setServices(servicesData || []);
    }
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
          <p className="text-zinc-400">Escolha um serviço para continuar</p>
        </div>

        {/* Lista de Serviços */}
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
            <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all">
              Continuar →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
