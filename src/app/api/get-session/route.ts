import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usar SERVICE_ROLE para criar usuários!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    console.log('🔍 Buscando sessão do Stripe:', sessionId);
    
    // 1. Buscar dados da sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    const email = session.customer_email || session.customer_details?.email;
    
    if (!email) {
      throw new Error('Email não encontrado na sessão do Stripe');
    }
    
    console.log('📧 Email do cliente:', email);
    
    // 2. Gerar senha aleatória
    const password = generateSecurePassword();
    console.log('🔑 Senha gerada');
    
    // 3. CRIAR usuário no Supabase Auth
    console.log('👤 Criando usuário no Supabase Auth...');
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmar email automaticamente!
      user_metadata: {
        plan: session.metadata?.plan || 'paid',
        stripe_session_id: sessionId,
        stripe_customer_id: session.customer
      }
    });
    
    if (authError) {
      console.error('❌ Erro ao criar usuário no Auth:', authError);
      throw authError;
    }
    
    console.log('✅ Usuário criado no Auth:', authData.user.id);
    
    // 4. CRIAR registro na tabela users
    console.log('📊 Tentando criar registro na tabela users...');
    console.log('📊 Dados para inserir:', {
      auth_id: authData.user.id,
      email: email,
      name: session.customer_details?.name || 'Cliente',
      whatsapp: session.customer_details?.phone || '',
      plan: 'premium',
      stripe_customer_id: session.customer,
      stripe_session_id: sessionId
    });
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: email,
        name: session.customer_details?.name || 'Cliente',
        whatsapp: session.customer_details?.phone || '',
        plan: 'premium', // Cliente pagou!
        stripe_customer_id: session.customer,
        stripe_session_id: sessionId
      })
      .select()
      .single();
    
    console.log('📊 RESULTADO do INSERT:');
    console.log('   userData:', userData);
    console.log('   userError:', JSON.stringify(userError, null, 2));
    
    if (userError) {
      console.error('❌❌❌ ERRO CRÍTICO ao criar na tabela users:', userError);
      console.error('❌ Código:', userError.code);
      console.error('❌ Mensagem:', userError.message);
      console.error('❌ Details:', userError.details);
      // Continuar mesmo com erro (usuário Auth já foi criado)
    } else {
      console.log('✅ Registro criado na tabela users:', userData.id);
    }
    
    console.log('🎉 Conta criada com sucesso!');
    
    return NextResponse.json({
      success: true,
      email: email,
      password: password,
      paid: true,
      userId: authData.user.id
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao processar sessão:', error);
    
    return NextResponse.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}

function generateSecurePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
