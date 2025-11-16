import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Função helper para criar cliente Supabase em route handlers
function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignorar erros de cookie em route handlers
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignorar erros de cookie em route handlers
          }
        },
      },
    }
  );
}

// GET - Buscar agendamentos
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return Response.json({
        success: false,
        error: 'Não autenticado'
      }, { status: 401 });
    }

    // Buscar ID do usuário na tabela users
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', session.user.id)
      .single();
    
    if (!userData) {
      return Response.json({
        success: false,
        error: 'Usuário não encontrado'
      }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('barber_id', userData.id);

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Erro ao buscar agendamentos:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Criar novo agendamento
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // 1. Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return Response.json({
        success: false,
        error: 'Não autenticado'
      }, { status: 401 });
    }
    
    // 2. Buscar ID do usuário na tabela users
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', session.user.id)
      .single();
    
    if (!userData) {
      return Response.json({
        success: false,
        error: 'Usuário não encontrado'
      }, { status: 404 });
    }
    
    // 3. Criar agendamento COM barber_id correto
    const body = await request.json();
    const { client_name, client_whatsapp, service, date, time } = body;

    // Validações
    if (!client_name || !client_whatsapp || !service || !date || !time) {
      return Response.json({ 
        success: false, 
        error: 'Todos os campos são obrigatórios' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        barber_id: userData.id, // ← ID CORRETO DO USUÁRIO LOGADO
        client_name,
        client_whatsapp,
        service,
        date,
        time,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ 
      success: true, 
      data,
      message: 'Agendamento criado com sucesso!' 
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar agendamento:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Atualizar agendamento
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return Response.json({
        success: false,
        error: 'Não autenticado'
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return Response.json({ 
        success: false, 
        error: 'ID é obrigatório' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ 
      success: true, 
      data,
      message: 'Agendamento atualizado com sucesso!' 
    });
  } catch (error: any) {
    console.error('❌ Erro ao atualizar agendamento:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
