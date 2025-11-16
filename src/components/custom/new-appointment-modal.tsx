"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface NewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  barberId: string
}

export function NewAppointmentModal({ isOpen, onClose, onSuccess, barberId }: NewAppointmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    client_name: "",
    client_whatsapp: "",
    service: "Corte",
    date: "",
    time: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barber_id: barberId,
          ...formData
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao criar agendamento')
      }

      alert('✅ Agendamento criado com sucesso!')
      setFormData({
        client_name: "",
        client_whatsapp: "",
        service: "Corte",
        date: "",
        time: ""
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro:', error)
      alert(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Novo Agendamento</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Cliente</label>
            <input
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <input
              type="tel"
              required
              value={formData.client_whatsapp}
              onChange={(e) => setFormData({ ...formData, client_whatsapp: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Serviço</label>
            <select
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
            >
              <option value="Corte">Corte - R$ 40</option>
              <option value="Barba">Barba - R$ 30</option>
              <option value="Combo">Combo - R$ 60</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Horário</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Criar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
