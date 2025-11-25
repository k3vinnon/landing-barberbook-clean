"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
              <Calendar className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">BarberBook</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Recursos
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Preços
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Depoimentos
            </Link>
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/50"
          >
            Começar Agora
          </button>
        </div>
      </div>
    </header>
  );
}
