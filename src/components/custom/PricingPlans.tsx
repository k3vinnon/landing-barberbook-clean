"use client";

import { Check, Star, ArrowRight } from "lucide-react";

interface PricingPlansProps {
  onSelectPlan: (plan: "trial" | "paid") => void;
}

export function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  return (
    <section id="pricing" className="bg-gradient-to-b from-zinc-900 to-black py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl text-white">
              Escolha Sua Oferta:
            </h2>
            <p className="text-xl text-zinc-400">Comece hoje e transforme seu negócio</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Plano Teste Grátis */}
            <div className="rounded-3xl border-2 border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-zinc-700">
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-white">Teste Grátis</h3>
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
                onClick={() => onSelectPlan("trial")}
                className="w-full rounded-xl border-2 border-white bg-transparent px-6 py-4 font-bold text-white transition-all hover:bg-white hover:text-black"
              >
                COMEÇAR TESTE GRÁTIS
              </button>
            </div>

            {/* Plano Pago (RECOMENDADO) */}
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
                onClick={() => onSelectPlan("paid")}
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
  );
}
