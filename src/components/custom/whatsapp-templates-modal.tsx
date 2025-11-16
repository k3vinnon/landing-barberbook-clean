"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"

interface WhatsAppTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
}

const TEMPLATES = [
  {
    title: "Confirmação de Agendamento",
    message: `Olá [NOME]! 👋

Seu agendamento está confirmado! ✅

📅 Data: [DATA]
⏰ Horário: [HORÁRIO]
✂️ Serviço: [SERVIÇO]

📍 Endereço: [SEU ENDEREÇO]

Nos vemos em breve! 💈`
  },
  {
    title: "Lembrete 24h Antes",
    message: `Oi [NOME]! 👋

Lembrando que amanhã você tem horário marcado! ⏰

📅 Data: [DATA]
⏰ Horário: [HORÁRIO]
✂️ Serviço: [SERVIÇO]

Confirma presença? 🙏`
  },
  {
    title: "Agradecimento Pós-Atendimento",
    message: `Valeu [NOME]! 🙏

Foi um prazer te atender hoje! ✂️

Espero que tenha gostado do resultado! 😊

Até a próxima! 💈`
  },
  {
    title: "Cancelamento",
    message: `Oi [NOME]! 👋

Seu agendamento foi cancelado:

📅 Data: [DATA]
⏰ Horário: [HORÁRIO]

Quer remarcar? É só me chamar! 📲`
  }
]

export function WhatsAppTemplatesModal({ isOpen, onClose }: WhatsAppTemplatesModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      alert('Erro ao copiar. Tente novamente.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Templates WhatsApp</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {TEMPLATES.map((template, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-black p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#FFD700]">{template.title}</h3>
                <button
                  onClick={() => copyToClipboard(template.message, index)}
                  className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-zinc-400 font-mono">
                {template.message}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-zinc-800 p-4">
          <p className="text-sm text-zinc-400">
            💡 <strong>Dica:</strong> Substitua os campos entre colchetes [NOME], [DATA], [HORÁRIO], etc. 
            pelos dados reais do cliente antes de enviar.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
