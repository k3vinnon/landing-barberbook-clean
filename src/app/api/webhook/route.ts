import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  // Processar evento checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('📧 Checkout completado:', session.id);
    console.log('Cliente:', session.customer_email);
    console.log('Metadata:', session.metadata);

    const { name, whatsapp, plan } = session.metadata || {};
    const email = session.customer_email;

    if (!email || !name) {
      console.error('Email ou nome faltando nos metadata');
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Gerar senha temporária
    const temporaryPassword = generatePassword();

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          name: name,
          whatsapp: whatsapp,
          plan: plan,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        return NextResponse.json({ error: authError.message }, { status: 500 });
      }

      console.log('✅ Usuário criado:', authData.user.id);

      // 2. Enviar email de boas-vindas
      const emailResult = await resend.emails.send({
        from: 'BarberBook <onboarding@resend.dev>', // Ou seu domínio verificado
        to: email,
        subject: '🎉 Bem-vindo ao BarberBook - Suas Credenciais de Acesso',
        html: getWelcomeEmailHTML(name, email, temporaryPassword, plan)
      });

      console.log('✅ Email enviado:', emailResult.id);

      return NextResponse.json({ 
        success: true, 
        userId: authData.user.id,
        emailId: emailResult.id
      });

    } catch (error: any) {
      console.error('Erro no webhook:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Função para gerar senha temporária segura
function generatePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Template de email
function getWelcomeEmailHTML(name: string, email: string, password: string, plan: string): string {
  const planNames: Record<string, string> = {
    'trial': 'Teste Grátis de 7 dias',
    'monthly': 'Plano Mensal',
    'annual': 'Plano Anual'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bem-vindo ao BarberBook!</h1>
          <p>Sua conta foi criada com sucesso</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>${name}</strong>!</p>
          
          <p>Obrigado por assinar o <strong>${planNames[plan] || plan}</strong>. 
          Estamos muito felizes em tê-lo conosco!</p>
          
          <div class="credentials">
            <h3>🔑 Suas Credenciais de Acesso:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Senha Temporária:</strong> <code>${password}</code></p>
            <p style="color: #e74c3c; font-size: 14px;">
              ⚠️ Por segurança, altere sua senha no primeiro acesso!
            </p>
          </div>
          
          <p style="text-align: center;">
            <a href="https://barberbook.club/login" class="button">
              Acessar Minha Conta →
            </a>
          </p>
          
          <h3>📋 Próximos Passos:</h3>
          <ol>
            <li>Clique no botão acima para fazer login</li>
            <li>Use as credenciais fornecidas</li>
            <li>Altere sua senha no menu Configurações</li>
            <li>Complete seu perfil e configurações</li>
            <li>Comece a usar o sistema!</li>
          </ol>
          
          <h3>💡 Precisa de Ajuda?</h3>
          <p>Nossa equipe está aqui para ajudar:</p>
          <ul>
            <li>📧 Email: suporte@barberbook.club</li>
            <li>📱 WhatsApp: ${whatsapp || '+351 912 345 678'}</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2024 BarberBook. Todos os direitos reservados.</p>
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
