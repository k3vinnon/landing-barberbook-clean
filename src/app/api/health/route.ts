export async function GET() {
  const checks = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    stripePublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  }
  
  const allConfigured = Object.values(checks).every(v => v === true)
  
  return Response.json({
    status: allConfigured ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    checks,
    missing: Object.entries(checks)
      .filter(([, value]) => !value)
      .map(([key]) => key)
  })
}
