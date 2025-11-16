import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // Validar variáveis no início
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Variáveis Supabase não configuradas')
      return Response.json({
        success: false,
        error: 'Configuração do servidor incompleta'
      }, { status: 500 })
    }

    if (!supabaseAdmin) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada')
      return Response.json({
        success: false,
        error: 'Configuração admin do Supabase não disponível'
      }, { status: 500 })
    }

    const body = await request.json()
    const { name, email, whatsapp, barbershopName } = body
    
    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
    
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: name,
        whatsapp: whatsapp,
        barbershop_name: barbershopName
      }
    })
    
    if (authError) throw authError
    
    // 2. Criar entrada na tabela users
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)
    
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: authData.user.id,
        name: name,
        email: email,
        whatsapp: whatsapp,
        barbershop_name: barbershopName,
        subscription_status: 'trial',
        trial_ends_at: trialEndsAt.toISOString()
      })
      .select()
      .single()
    
    if (userError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw userError
    }
    
    // 3. Criar configurações padrão
    await supabaseAdmin.from('barber_settings').insert({
      barber_id: userData.id,
      working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      start_time: '09:00',
      end_time: '19:00',
      slot_duration: 30,
      services: [
        { name: 'Corte', price: 40, duration: 30 },
        { name: 'Barba', price: 30, duration: 20 },
        { name: 'Combo', price: 60, duration: 45 }
      ]
    })
    
    return Response.json({
      success: true,
      credentials: {
        email: email,
        password: tempPassword,
        username: userData.username,
        dashboardUrl: '/dashboard',
        publicUrl: `/${userData.username}`
      }
    })
    
  } catch (error: any) {
    console.error('Erro:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
