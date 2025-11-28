import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, isPaid } = await request.json();
    
    console.log('📧 Enviando email de boas-vindas para:', email);
    
    // Por enquanto, apenas log
    // Depois vamos integrar com serviço de email (Resend, SendGrid, etc.)
    
    const welcomeMessage = isPaid 
      ? 'Obrigado por assinar o BarberBook Premium! 🎉'
      : 'Bem-vindo ao seu teste grátis de 7 dias! 🎉';
    
    console.log('✅ Email simulado enviado:', {
      to: email,
      subject: welcomeMessage,
      credentials: { email, password },
      loginUrl: `https://barberbook.club/login`
    });
    
    // TODO: Integrar com serviço de email real
    // Exemplo com Resend:
    // await resend.emails.send({
    //   from: 'BarberBook <noreply@barberbook.club>',
    //   to: email,
    //   subject: welcomeMessage,
    //   html: emailTemplate({ email, password, isPaid })
    // });
    
    return NextResponse.json({ 
      success: true,
      message: 'Email enviado (simulado por enquanto)'
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar email:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
