import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  console.log('📥 API get-session chamada com sessionId:', sessionId);

  if (!sessionId) {
    console.error('❌ Session ID não fornecido');
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    console.log('🔍 Buscando sessão no Stripe...');
    
    // Buscar sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('✅ Sessão encontrada:', {
      id: session.id,
      status: session.payment_status,
      email: session.customer_email || session.customer_details?.email
    });
    
    // Extrair email do cliente
    const email = session.customer_email || session.customer_details?.email;
    
    if (!email) {
      console.error('❌ Email não encontrado na sessão');
      return NextResponse.json({ 
        error: 'Email não encontrado na sessão',
        success: false 
      }, { status: 400 });
    }
    
    // Gerar senha aleatória
    const password = generateRandomPassword();
    
    console.log('🔐 Credenciais geradas:', { email, password: '***' });
    
    // TODO: Criar usuário no Supabase com esses dados
    // Exemplo:
    // const { data, error } = await supabase.auth.admin.createUser({
    //   email: email,
    //   password: password,
    //   email_confirm: true
    // });
    
    console.log('✅ Retornando credenciais para o cliente');
    
    return NextResponse.json({
      success: true,
      email: email,
      password: password,
      paid: session.payment_status === 'paid',
      sessionId: session.id
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar sessão do Stripe:', error);
    
    return NextResponse.json({ 
      error: error.message,
      success: false
    }, { status: 500 });
  }
}

function generateRandomPassword(): string {
  // Gerar senha aleatória segura de 12 caracteres
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}
