"use client";

import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-[#FFD700]" />
              <span className="text-xl font-bold">BarberBook</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="mb-8 text-4xl font-bold">Termos e Condições</h1>
          <p className="mb-6 text-zinc-400">Última atualização: Janeiro de 2024</p>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">1. Aceitação dos Termos</h2>
              <p className="text-zinc-300">
                Ao acessar e usar o BarberBook, você concorda com estes Termos e Condições. Se você não
                concordar com qualquer parte destes termos, não use nosso serviço.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">2. Descrição do Serviço</h2>
              <p className="mb-4 text-zinc-300">
                O BarberBook é uma plataforma de agendamento online para barbeiros autônomos que oferece:
              </p>
              <ul className="list-inside list-disc space-y-2 text-zinc-300">
                <li>Sistema de agendamento 24/7</li>
                <li>Lembretes automáticos por WhatsApp/SMS</li>
                <li>Relatórios de faturamento</li>
                <li>Integração com redes sociais</li>
                <li>Dashboard de gerenciamento</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">3. Planos e Pagamentos</h2>
              <p className="mb-4 text-zinc-300">
                <strong>Teste Grátis:</strong> 14 dias de acesso completo sem necessidade de cartão de crédito.
                Após o período, você pode optar por assinar um plano pago ou cancelar sem custos.
              </p>
              <p className="mb-4 text-zinc-300">
                <strong>Plano Pago:</strong> R$39 de taxa única + 3 meses grátis. Após os 3 meses, o plano
                renova automaticamente por R$79/mês, podendo ser cancelado a qualquer momento.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">4. Política de Reembolso</h2>
              <p className="text-zinc-300">
                Oferecemos garantia de reembolso de 7 dias para o plano pago. Se você não estiver satisfeito
                com o serviço nos primeiros 7 dias após o pagamento, entre em contato conosco para solicitar
                reembolso total.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">5. Cancelamento</h2>
              <p className="text-zinc-300">
                Você pode cancelar sua assinatura a qualquer momento através do dashboard. O cancelamento será
                efetivo ao final do período pago atual. Não há multas ou taxas de cancelamento.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">6. Uso Aceitável</h2>
              <p className="mb-4 text-zinc-300">Você concorda em NÃO:</p>
              <ul className="list-inside list-disc space-y-2 text-zinc-300">
                <li>Usar o serviço para atividades ilegais</li>
                <li>Compartilhar sua conta com terceiros</li>
                <li>Tentar hackear ou comprometer a segurança da plataforma</li>
                <li>Enviar spam ou conteúdo malicioso através do sistema</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">7. Propriedade Intelectual</h2>
              <p className="text-zinc-300">
                Todo o conteúdo, design, código e funcionalidades do BarberBook são propriedade exclusiva da
                empresa e protegidos por leis de direitos autorais.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">8. Limitação de Responsabilidade</h2>
              <p className="text-zinc-300">
                O BarberBook não se responsabiliza por perdas de faturamento, clientes não comparecidos ou
                problemas técnicos fora do nosso controle. Fornecemos o serviço "como está" e nos esforçamos
                para manter 99.9% de uptime.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">9. Modificações dos Termos</h2>
              <p className="text-zinc-300">
                Reservamos o direito de modificar estes termos a qualquer momento. Mudanças significativas
                serão comunicadas por e-mail com 30 dias de antecedência.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">10. Contato</h2>
              <p className="text-zinc-300">
                Para dúvidas sobre estes termos, entre em contato:
                <br />
                E-mail: suporte@barberbook.com
                <br />
                WhatsApp: (11) 99999-9999
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FFD700]" />
              <span className="font-bold">BarberBook</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-400">
              <Link href="/terms" className="hover:text-white">
                Termos
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
