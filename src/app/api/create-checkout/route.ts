import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, whatsapp, barbershopName, planType } = body

    // Validar dados obrigatórios
    if (!email || !name || !whatsapp || !barbershopName) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // TESTE GRÁTIS - Criar usuário sem pagamento
    if (planType === 'trial') {
      try {
        // Verificar se usuário já existe
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, email, subscription_status')
          .eq('email', email)
          .single()

        if (existingUser) {
          return NextResponse.json(
            { error: 'Este email já está cadastrado' },
            { status: 400 }
          )
        }

        // Calcular data de fim do trial (14 dias)
        const trialEndsAt = new Date()
        trialEndsAt.setDate(trialEndsAt.getDate() + 14)

        // Criar novo usuário com trial
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email,
            name,
            whatsapp,
            barbershop_name: barbershopName,
            subscription_status: 'trial',
            trial_ends_at: trialEndsAt.toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error('Erro ao criar usuário trial:', insertError)
          return NextResponse.json(
            { error: 'Erro ao criar conta. Tente novamente.' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          trial: true,
          userId: newUser.id,
          message: 'Teste grátis ativado com sucesso!',
        })
      } catch (error) {
        console.error('Erro no fluxo de trial:', error)
        return NextResponse.json(
          { error: 'Erro ao processar teste grátis' },
          { status: 500 }
        )
      }
    }

    // PLANO PAGO - Criar checkout do Stripe
    try {
      // Inicializar Stripe apenas quando necessário
      const stripe = getStripe()

      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      let userId = existingUser?.id

      // Se não existe, criar novo usuário
      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email,
            name,
            whatsapp,
            barbershop_name: barbershopName,
            subscription_status: 'pending',
          })
          .select()
          .single()

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError)
          return NextResponse.json(
            { error: 'Erro ao criar conta' },
            { status: 500 }
          )
        }

        userId = newUser.id
      }

      // Criar customer no Stripe
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId: userId || '',
          whatsapp,
          barbershopName,
        },
      })

      // Atualizar usuário com stripe_customer_id
      await supabase
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', userId)

      // Criar sessão de checkout do Stripe
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'BarberBook Premium',
                description: 'Sistema de agendamento para barbeiros - R$97/mês',
              },
              unit_amount: 9700, // R$97 em centavos
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
        metadata: {
          userId: userId || '',
        },
      })

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      })
    } catch (stripeError) {
      console.error('Erro no Stripe:', stripeError)
      return NextResponse.json(
        { error: 'Erro ao processar pagamento. Verifique suas configurações do Stripe.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro geral na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
