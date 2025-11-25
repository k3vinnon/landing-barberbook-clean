"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  planType: "trial" | "paid"
}

export function CheckoutModal({ isOpen, onClose, planType }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    barbershopName: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validações do frontend
    if (!formData.name.trim()) {
      setError("Por favor, preencha seu nome completo")
      return
    }

    if (!formData.email.trim()) {
      setError("Por favor, preencha seu email")
      return
    }

    if (!formData.whatsapp.trim()) {
      setError("Por favor, preencha seu WhatsApp")
      return
    }

    if (!formData.barbershopName.trim()) {
      setError("Por favor, preencha o nome da barbearia")
      return
    }

    if (!formData.acceptTerms) {
      setError("Você precisa aceitar os termos e condições")
      return
    }

    setIsLoading(true)

    try {
      // Usar rota específica para trial ou checkout
      const endpoint = planType === "trial" ? "/api/trial" : "/api/create-checkout"
      
      console.log('🚀 Enviando requisição para:', endpoint)
      console.log('📦 Dados:', { ...formData, email: '***@***' })
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim(),
          whatsapp: formData.whatsapp.trim(),
          barbershopName: formData.barbershopName.trim(),
          planType,
        }),
      })

      console.log('📡 Status da resposta:', response.status)

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("❌ Resposta não é JSON:", textResponse)
        throw new Error("Erro no servidor. Verifique se as variáveis de ambiente estão configuradas.")
      }

      const data = await response.json()
      console.log('📥 Resposta do servidor:', data)

      if (!response.ok || !data.success) {
        console.error('❌ Erro detalhado:', {
          status: response.status,
          data: data,
          error: data.error
        })
        
        throw new Error(data.error || data.message || "Erro ao processar solicitação")
      }

      console.log('✅ Sucesso! Conta criada.')

      // Se for trial, redirecionar para dashboard (backend já redirecionou)
      if (planType === "trial") {
        router.push('/dashboard')
        return
      }

      // Se for pago, redirecionar para Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("URL de pagamento não encontrada")
      }
    } catch (err) {
      console.error("❌ Erro no checkout:", err)
      setError(err instanceof Error ? err.message : "Erro ao processar. Tente novamente.")
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {planType === "trial" ? "Começar Teste Grátis" : "Garantir Oferta Agora"}
          </h2>
          <p className="text-zinc-400">
            {planType === "trial"
              ? "14 dias grátis, sem compromisso"
              : "R$39 hoje + 3 meses grátis"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="João Silva"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-zinc-300 mb-1">
              WhatsApp *
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="(11) 99999-9999"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="barbershopName" className="block text-sm font-medium text-zinc-300 mb-1">
              Nome da Barbearia *
            </label>
            <input
              type="text"
              id="barbershopName"
              name="barbershopName"
              value={formData.barbershopName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="Barbearia do João"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-[#FFD700] focus:ring-[#FFD700]"
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms" className="text-sm text-zinc-400">
              Aceito os{" "}
              <a href="/terms" className="text-[#FFD700] hover:underline">
                termos e condições
              </a>
              {" "}e a{" "}
              <a href="/privacy" className="text-[#FFD700] hover:underline">
                política de privacidade
              </a>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : planType === "trial" ? (
              "ATIVAR TESTE GRÁTIS"
            ) : (
              "GARANTIR OFERTA AGORA"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-zinc-500">
          {planType === "trial"
            ? "Cancele a qualquer momento durante o período de teste"
            : "Pagamento seguro processado pelo Stripe"}
        </div>
      </div>
    </div>
  )
}
