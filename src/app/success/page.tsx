"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Copy, ExternalLink, Download } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const isTrial = searchParams.get("trial") === "true"
  const email = searchParams.get("email")
  
  const [copied, setCopied] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular busca de dados do usuário
    // Em produção, buscar do Supabase usando session_id ou email
    setTimeout(() => {
      setUserData({
        email: email || "seu@email.com",
        password: "senha-temporaria-123",
        dashboardUrl: "https://barberbook.club/dashboard",
        bookingUrl: "https://barberbook.club/joao-silva",
      })
      setLoading(false)
    }, 1000)
  }, [email, sessionId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header de Sucesso */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎉 {isTrial ? "Teste Grátis Ativado!" : "Pagamento Confirmado!"}
            </h1>
            <p className="text-xl text-gray-400">
              Seu BarberBook está pronto para usar
            </p>
          </div>

          {/* Credenciais de Acesso */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#D4AF37]/20 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-[#D4AF37] mr-2">🔑</span>
              Suas Credenciais de Acesso
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={userData.email}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(userData.email)}
                    className="p-3 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Senha Temporária</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={userData.password}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(userData.password)}
                    className="p-3 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ Altere sua senha após o primeiro login
                </p>
              </div>

              <Link
                href="/dashboard"
                className="block w-full py-4 px-6 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold text-center hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all"
              >
                ACESSAR DASHBOARD
                <ExternalLink className="inline-block ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#D4AF37]/20 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-[#D4AF37] mr-2">📋</span>
              Próximos Passos
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold mb-1">Configure seus horários de trabalho</h3>
                  <p className="text-gray-400 text-sm">
                    Defina seus dias e horários disponíveis para agendamentos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold mb-1">Compartilhe seu link personalizado</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Seus clientes podem agendar diretamente pelo link:
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={userData.bookingUrl}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(userData.bookingUrl)}
                      className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold mb-1">Use o template WhatsApp</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Baixe nosso template profissional para confirmar agendamentos
                  </p>
                  <button className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors text-sm flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Template WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suporte */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#D4AF37]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-[#D4AF37] mr-2">💬</span>
              Precisa de Ajuda?
            </h2>
            <p className="text-gray-400 mb-4">
              Nossa equipe está pronta para ajudar você a começar
            </p>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-colors font-bold"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com Suporte
            </a>
          </div>

          {/* Status do Plano */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              {isTrial ? "Teste Grátis Ativo - 14 dias restantes" : "Assinatura Ativa"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
