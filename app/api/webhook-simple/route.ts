export async function POST(request: Request) {
  console.log('🔥 WEBHOOK SIMPLES CHAMADO!');
  
  return new Response(
    JSON.stringify({ success: true, message: 'Webhook working!' }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
