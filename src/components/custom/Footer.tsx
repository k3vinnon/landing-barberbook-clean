"use client";

import { Calendar, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
                <Calendar className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">BarberBook</span>
            </div>
            <p className="mb-4 max-w-md text-sm text-zinc-400">
              Sistema completo de agendamento para barbearias. Automatize seus horários, reduza no-show e aumente seu faturamento.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/barberbook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-[#FFD700] hover:text-[#FFD700]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:contato@barberbook.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-[#FFD700] hover:text-[#FFD700]"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="mb-4 font-bold text-white">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-zinc-400 hover:text-white">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-zinc-400 hover:text-white">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-zinc-400 hover:text-white">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-bold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-white">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-white">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-zinc-400 hover:text-white">
                  Política de Reembolso
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-zinc-800 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} BarberBook. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
