import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Buscar configurações
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const barberId = searchParams.get('barber_id');

    if (!barberId) {
      return Response.json({ 
        success: false, 
        error: 'barber_id é obrigatório' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('barber_settings')
      .select('*')
      .eq('barber_id', barberId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Se não existir, retornar configurações padrão
    if (!data) {
      return Response.json({ 
        success: true, 
        data: {
          working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          start_time: '09:00',
          end_time: '18:00',
          slot_duration: 30,
          services: [
            { name: 'Corte', price: 40, duration: 30 },
            { name: 'Barba', price: 30, duration: 20 },
            { name: 'Combo', price: 60, duration: 50 }
          ]
        }
      });
    }

    return Response.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Erro ao buscar configurações:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Criar/Atualizar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barber_id, working_days, start_time, end_time, slot_duration, services } = body;

    if (!barber_id) {
      return Response.json({ 
        success: false, 
        error: 'barber_id é obrigatório' 
      }, { status: 400 });
    }

    // Tentar atualizar primeiro
    const { data: existing } = await supabase
      .from('barber_settings')
      .select('id')
      .eq('barber_id', barber_id)
      .single();

    let result;
    if (existing) {
      // Atualizar
      result = await supabase
        .from('barber_settings')
        .update({
          working_days,
          start_time,
          end_time,
          slot_duration,
          services
        })
        .eq('barber_id', barber_id)
        .select()
        .single();
    } else {
      // Criar
      result = await supabase
        .from('barber_settings')
        .insert({
          barber_id,
          working_days,
          start_time,
          end_time,
          slot_duration,
          services
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return Response.json({ 
      success: true, 
      data: result.data,
      message: 'Configurações salvas com sucesso!' 
    });
  } catch (error: any) {
    console.error('❌ Erro ao salvar configurações:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
