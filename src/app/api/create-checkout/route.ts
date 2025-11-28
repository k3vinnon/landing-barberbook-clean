import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // IMPORTANTE!

export async function POST(request: Request) {
  try {
    console.log('📥 API create-checkout chamada');
    
    const body = await request.json();
    console.log('📊 Body recebido:', body);
    
    // POR ENQUANTO: Retornar mock sem usar Stripe
    // Vamos testar se a API pelo menos funciona!
    
    const mockUrl = `/success?email=teste@exemplo.com&password=senha123&plan=${body.plan}`;
    
    console.log('✅ Retornando mock URL:', mockUrl);
    
    return NextResponse.json({ 
      url: mockUrl,
      success: true,
      message: 'Mock checkout - Stripe será configurado depois'
    });
    
  } catch (error: any) {
    console.error('❌ Erro na API:', error);
    
    return NextResponse.json({ 
      error: error.message,
      success: false
    }, { status: 500 });
  }
}
