"use client";

import { useState } from "react";
import { Calendar, Clock, TrendingUp, Smartphone, Bell, BarChart3, Instagram, Headphones, Check, ArrowRight, Star } from "lucide-react";
import { CheckoutModal } from "@/components/custom/checkout-modal";

export default function BarberBookLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"trial" | "paid">("trial");

  const openCheckout = (plan: "trial" | "paid") => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planType={selectedPlan}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2">
                <Calendar className="h-6 w-6 text-black" />
                <span className="font-bold text-black text-xl">BarberBook</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Pare de Perder Clientes no WhatsApp.{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Agende 3x Mais Cortes
              </span>{" "}
              Automaticamente.
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-lg text-zinc-400 sm:text-xl md:text-2xl">
              Sistema simples que elimina confusão de horários e dobra seu faturamento em 30 dias
            </p>

            {/* CTA Principal */}
            <button
              onClick={() => document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/50 sm:px-10 sm:py-5 sm:text-xl"
            >
              QUERO TESTAR GRÁTIS
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Trust Badge */}
            <p className="mt-6 text-sm text-zinc-500">
              ✓ Sem cartão de crédito • ✓ Configuração em 5 minutos • ✓ Suporte em português
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEMA SECTION */}
      <section className="bg-zinc-900 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                Você Perde <span className="text-[#FFD700]">3-5 Clientes Por Dia</span> Por:
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-black p-6 transition-all hover:border-[#FFD700]/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Agendamentos Perdidos</h3>
                <p className="text-zinc-400">Mensagens que se perdem no WhatsApp entre conversas pessoais</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-6 transition-all hover:border-[#FFD700]/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">15-20% No-Show</h3>
                <p className="text-zinc-400">Clientes que esquecem horários e não aparecem</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-6 transition-all hover:border-[#FFD700]/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <span className="text-2xl">⌛</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">2-3h/Dia Perdidas</h3>
                <p className="text-zinc-400">Tempo administrando em vez de cortando cabelo</p>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border-2 border-red-500 bg-red-500/10 p-8 text-center">
              <p className="text-2xl font-bold text-red-400 sm:text-3xl">
                Isso custa R$1.500 - R$2.500/mês em faturamento perdido
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO SECTION */}
      <section className="bg-black py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                <span className="text-[#FFD700]">BarberBook</span> Resolve em 3 Cliques:
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-[#FFD700] hover:shadow-2xl hover:shadow-[#FFD700]/20">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
                  <Smartphone className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Agendamento 24h Automático</h3>
                <p className="text-zinc-400">Clientes agendam sozinhos, mesmo quando você está dormindo</p>
              </div>

              <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-[#FFD700] hover:shadow-2xl hover:shadow-[#FFD700]/20">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
                  <Bell className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Lembretes Automáticos</h3>
                <p className="text-zinc-400">WhatsApp/SMS automáticos reduzem no-show para menos de 5%</p>
              </div>

              <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-[#FFD700] hover:shadow-2xl hover:shadow-[#FFD700]/20">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
                  <BarChart3 className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Relatórios em Tempo Real</h3>
                <p className="text-zinc-400">Veja seu faturamento crescer dia após dia</p>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border-2 border-[#FFD700] bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 p-8 text-center">
              <p className="text-2xl font-bold text-[#FFD700] sm:text-3xl">
                ⏰ Ganhe 2-3 Horas Por Dia de Volta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ATTRACTION OFFER SECTION */}
      <section id="offer" className="bg-gradient-to-b from-zinc-900 to-black py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                Escolha Sua Oferta:
              </h2>
              <p className="text-xl text-zinc-400">Comece hoje e transforme seu negócio</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Opção A - Pay More Later */}
              <div className="rounded-3xl border-2 border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-zinc-700">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">Teste Grátis</h3>
                  <p className="text-zinc-400">Experimente sem compromisso</p>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">R$0</span>
                    <span className="text-xl text-zinc-400">agora</span>
                  </div>
                  <p className="text-zinc-500">R$79/mês depois do período de teste</p>
                </div>

                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-zinc-400" />
                    <span className="text-zinc-300">14 dias grátis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-zinc-400" />
                    <span className="text-zinc-300">Sem cartão de crédito</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-zinc-400" />
                    <span className="text-zinc-300">Cancele quando quiser</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-zinc-400" />
                    <span className="text-zinc-300">Todos os recursos incluídos</span>
                  </li>
                </ul>

                <button
                  onClick={() => openCheckout("trial")}
                  className="w-full rounded-xl border-2 border-white bg-transparent px-6 py-4 font-bold text-white transition-all hover:bg-white hover:text-black"
                >
                  COMEÇAR TESTE GRÁTIS
                </button>
              </div>

              {/* Opção B - Pay Less Now (RECOMENDADO) */}
              <div className="relative rounded-3xl border-2 border-[#FFD700] bg-gradient-to-br from-zinc-900 to-black p-8 shadow-2xl shadow-[#FFD700]/20">
                {/* Badge Recomendado */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2">
                    <Star className="h-4 w-4 text-black" />
                    <span className="font-bold text-black text-sm">MAIS ESCOLHIDO</span>
                  </div>
                </div>

                <div className="mb-6 mt-4">
                  <h3 className="mb-2 text-2xl font-bold text-[#FFD700]">Começar por R$39</h3>
                  <p className="text-zinc-400">Economize R$198 + Ganhe Bônus</p>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#FFD700]">R$39</span>
                    <span className="text-xl text-zinc-400">hoje</span>
                  </div>
                  <p className="text-zinc-300 font-semibold">+ 3 MESES GRÁTIS (R$237 de valor)</p>
                  <p className="mt-1 text-sm text-zinc-500 line-through">R$79/mês depois</p>
                </div>

                <ul className="mb-8 space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#FFD700]" />
                    <span className="text-white font-semibold">3 meses grátis (economize R$237)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#FFD700]" />
                    <span className="text-white font-semibold">Template WhatsApp Profissional (R$97)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#FFD700]" />
                    <span className="text-zinc-300">Todos os recursos premium</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#FFD700]" />
                    <span className="text-zinc-300">Suporte prioritário</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#FFD700]" />
                    <span className="text-zinc-300">Configuração assistida</span>
                  </li>
                </ul>

                <button
                  onClick={() => openCheckout("paid")}
                  className="group w-full rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-4 font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/50"
                >
                  GARANTIR OFERTA AGORA
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>

                <p className="mt-4 text-center text-xs text-zinc-500">
                  🔒 Pagamento seguro • Garantia de 7 dias
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="bg-black py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <div className="mb-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 fill-[#FFD700] text-[#FFD700]" />
                ))}
              </div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Já usado por <span className="text-[#FFD700]">50+ barbeiros</span> que aumentaram faturamento em{" "}
                <span className="text-[#FFD700]">47%</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="mb-6 text-lg text-zinc-300">
                  "Ganhei 3h por dia com BarberBook. Vale cada centavo! Meus clientes adoram poder agendar a qualquer hora."
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700] font-bold text-black">
                    C
                  </div>
                  <div>
                    <p className="font-bold">Carlos Silva</p>
                    <p className="text-sm text-zinc-500">Barbeiro • São Paulo, SP</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="mb-6 text-lg text-zinc-300">
                  "Clientes não esquecem mais. Show-rate subiu de 80% para 95%. Faturamento aumentou R$1.800/mês!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700] font-bold text-black">
                    J
                  </div>
                  <div>
                    <p className="font-bold">João Mendes</p>
                    <p className="text-sm text-zinc-500">Barbeiro • Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="bg-zinc-900 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                Tudo que Você Precisa em <span className="text-[#FFD700]">Um Só Lugar</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-black p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/10">
                  <Calendar className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">Agendamento 24h Automático</h3>
                  <p className="text-sm text-zinc-400">Clientes agendam sozinhos</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-black p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/10">
                  <Bell className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">Lembretes WhatsApp/SMS</h3>
                  <p className="text-sm text-zinc-400">Reduz no-show para menos de 5%</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-black p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/10">
                  <TrendingUp className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">Relatórios de Faturamento</h3>
                  <p className="text-sm text-zinc-400">Acompanhe crescimento em tempo real</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-black p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/10">
                  <Instagram className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">Integração com Instagram</h3>
                  <p className="text-sm text-zinc-400">Link direto no bio</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-black p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/10">
                  <Headphones className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">Suporte em Português</h3>
                  <p className="text-sm text-zinc-400">Atendimento rápido e eficiente</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-black p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/10">
                  <Smartphone className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">App Mobile Nativo</h3>
                  <p className="text-sm text-zinc-400">iOS e Android</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-gradient-to-b from-black via-zinc-900 to-black py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
              Pare de Perder Dinheiro com Agendamentos
            </h2>
            <p className="mb-10 text-xl text-zinc-400">
              Escolha sua oferta agora e transforme seu negócio em 30 dias
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => openCheckout("paid")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-8 py-5 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/50"
              >
                R$39 HOJE + 3 MESES GRÁTIS
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => openCheckout("trial")}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-5 text-lg font-bold text-white transition-all hover:bg-white hover:text-black"
              >
                TESTAR GRÁTIS
              </button>
            </div>

            <p className="mt-8 text-sm text-zinc-500">
              ✓ Sem compromisso • ✓ Cancele quando quiser • ✓ Garantia de 7 dias
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-black py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FFD700]" />
              <span className="font-bold text-white">BarberBook</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-400">
              <a href="/terms" className="hover:text-white">Termos</a>
              <a href="/privacy" className="hover:text-white">Privacidade</a>
            </div>
            <p className="text-sm text-zinc-500">© 2024 BarberBook. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
