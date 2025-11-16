"use client";

import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
          <h1 className="mb-8 text-4xl font-bold">Política de Privacidade</h1>
          <p className="mb-6 text-zinc-400">Última atualização: Janeiro de 2024</p>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">1. Informações que Coletamos</h2>
              <p className="mb-4 text-zinc-300">Coletamos as seguintes informações quando você usa o BarberBook:</p>
              <ul className="list-inside list-disc space-y-2 text-zinc-300">
                <li>
                  <strong>Dados de Cadastro:</strong> Nome, e-mail, telefone/WhatsApp, nome da barbearia
                </li>
                <li>
                  <strong>Dados de Agendamentos:</strong> Informações de clientes (nome, telefone, horários)
                </li>
                <li>
                  <strong>Dados de Uso:</strong> Como você interage com a plataforma, páginas visitadas, recursos
                  utilizados
                </li>
                <li>
                  <strong>Dados de Pagamento:</strong> Processados por gateway seguro (não armazenamos dados de
                  cartão)
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">2. Como Usamos Suas Informações</h2>
              <p className="mb-4 text-zinc-300">Utilizamos seus dados para:</p>
              <ul className="list-inside list-disc space-y-2 text-zinc-300">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar sua assinatura</li>
                <li>Enviar lembretes de agendamentos aos seus clientes</li>
                <li>Comunicar atualizações, novidades e suporte técnico</li>
                <li>Gerar relatórios e estatísticas para você</li>
                <li>Prevenir fraudes e garantir segurança</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">3. Compartilhamento de Dados</h2>
              <p className="mb-4 text-zinc-300">
                <strong>NÃO vendemos seus dados.</strong> Compartilhamos informações apenas com:
              </p>
              <ul className="list-inside list-disc space-y-2 text-zinc-300">
                <li>
                  <strong>Provedores de Serviço:</strong> Gateway de pagamento, serviço de e-mail/SMS, hospedagem
                </li>
                <li>
                  <strong>Requisitos Legais:</strong> Quando exigido por lei ou ordem judicial
                </li>
                <li>
                  <strong>Seus Clientes:</strong> Dados necessários para confirmação de agendamentos (nome, horário)
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">4. Segurança dos Dados</h2>
              <p className="text-zinc-300">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-300">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Senhas criptografadas com hash seguro</li>
                <li>Servidores protegidos com firewall e monitoramento 24/7</li>
                <li>Backups automáticos diários</li>
                <li>Acesso restrito aos dados apenas para equipe autorizada</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">5. Seus Direitos (LGPD)</h2>
              <p className="mb-4 text-zinc-300">De acordo com a Lei Geral de Proteção de Dados, você tem direito a:</p>
              <ul className="list-inside list-disc space-y-2 text-zinc-300">
                <li>
                  <strong>Acesso:</strong> Solicitar cópia de todos os seus dados
                </li>
                <li>
                  <strong>Correção:</strong> Atualizar dados incorretos ou desatualizados
                </li>
                <li>
                  <strong>Exclusão:</strong> Solicitar remoção completa de seus dados
                </li>
                <li>
                  <strong>Portabilidade:</strong> Exportar seus dados em formato legível
                </li>
                <li>
                  <strong>Revogação:</strong> Retirar consentimento para uso de dados
                </li>
              </ul>
              <p className="mt-4 text-zinc-300">
                Para exercer esses direitos, entre em contato: privacidade@barberbook.com
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">6. Cookies e Tecnologias Similares</h2>
              <p className="text-zinc-300">
                Usamos cookies essenciais para funcionamento da plataforma (login, preferências). Você pode
                desabilitar cookies no navegador, mas isso pode afetar funcionalidades.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">7. Retenção de Dados</h2>
              <p className="text-zinc-300">
                Mantemos seus dados enquanto sua conta estiver ativa. Após cancelamento, dados são retidos por 90
                dias para possível reativação, depois são permanentemente excluídos (exceto dados necessários para
                obrigações legais/fiscais).
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">8. Menores de Idade</h2>
              <p className="text-zinc-300">
                O BarberBook é destinado a profissionais maiores de 18 anos. Não coletamos intencionalmente dados
                de menores.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">9. Alterações nesta Política</h2>
              <p className="text-zinc-300">
                Podemos atualizar esta política periodicamente. Mudanças significativas serão comunicadas por
                e-mail com 30 dias de antecedência.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-[#FFD700]">10. Contato</h2>
              <p className="text-zinc-300">
                Para dúvidas sobre privacidade ou exercer seus direitos:
                <br />
                E-mail: privacidade@barberbook.com
                <br />
                WhatsApp: (11) 99999-9999
                <br />
                Endereço: Rua Exemplo, 123 - São Paulo, SP
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
